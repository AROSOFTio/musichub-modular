import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RemixJobStatus, Role } from "@prisma/client";
import { randomUUID } from "crypto";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";

import { AuthenticatedUser } from "../auth/decorators/current-user.decorator";
import { LocalStorageService } from "../catalog/local-storage.service";
import { slugify } from "../catalog/slug";
import { FeatureModulesService } from "../feature-modules/feature-modules.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRemixProjectDto } from "./dto/create-remix-project.dto";
import { UpdateRemixProjectDto } from "./dto/update-remix-project.dto";

@Injectable()
export class RemixService {
  private readonly uploadDir: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: LocalStorageService,
    private readonly configService: ConfigService,
    private readonly featureModules: FeatureModulesService,
  ) {
    this.uploadDir = this.configService.get<string>("UPLOAD_DIR") ?? "/app/uploads";
  }

  async listProjects(user: AuthenticatedUser) {
    await this.featureModules.assertEnabled("remix", "api");
    return this.prisma.remixProject.findMany({
      where: user.role === Role.ADMIN ? {} : { userId: user.userId },
      include: { sourceSong: { include: { artist: true, genre: true } } },
      orderBy: { updatedAt: "desc" },
    });
  }

  async getProject(user: AuthenticatedUser, id: string) {
    await this.featureModules.assertEnabled("remix", "api");
    return this.getOwnedProject(user, id);
  }

  async createProject(user: AuthenticatedUser, dto: CreateRemixProjectDto) {
    await this.featureModules.assertEnabled("remix", "api");
    const song = await this.prisma.song.findFirst({
      where: { id: dto.sourceSongId, isPublished: true },
      include: { artist: true },
    });
    if (!song) throw new NotFoundException("Source song was not found.");
    if (!song.allowRemix) throw new ForbiddenException("This song cannot be remixed.");

    const title = dto.title?.trim() || `${song.title} Remix`;
    const project = await this.prisma.remixProject.create({
      data: {
        userId: user.userId,
        sourceSongId: song.id,
        title,
        slug: await this.uniqueSlug(title),
        bpm: dto.bpm ? this.clampInt(dto.bpm, 40, 240) : null,
      },
      include: { sourceSong: { include: { artist: true, genre: true } } },
    });
    return project;
  }

  async updateProject(user: AuthenticatedUser, id: string, dto: UpdateRemixProjectDto) {
    await this.featureModules.assertEnabled("remix", "api");
    const existing = await this.getOwnedProject(user, id);
    const title = dto.title?.trim() || existing.title;
    return this.prisma.remixProject.update({
      where: { id: existing.id },
      data: {
        title,
        bpm: dto.bpm === undefined ? existing.bpm : this.clampInt(dto.bpm, 40, 240),
        pitchShift: dto.pitchShift === undefined ? existing.pitchShift : this.clampInt(dto.pitchShift, -12, 12),
        tempo: dto.tempo === undefined ? existing.tempo : this.clamp(dto.tempo, 0.5, 2),
        volume: dto.volume === undefined ? existing.volume : this.clamp(dto.volume, 0, 2),
        bassBoost: dto.bassBoost === undefined ? existing.bassBoost : this.clamp(dto.bassBoost, 0, 12),
        trebleBoost: dto.trebleBoost === undefined ? existing.trebleBoost : this.clamp(dto.trebleBoost, 0, 12),
        reverb: dto.reverb === undefined ? existing.reverb : this.clamp(dto.reverb, 0, 1),
        echo: dto.echo === undefined ? existing.echo : this.clamp(dto.echo, 0, 1),
        isPublished: dto.isPublished ?? existing.isPublished,
      },
      include: { sourceSong: { include: { artist: true, genre: true } } },
    });
  }

  async processProject(user: AuthenticatedUser, id: string) {
    await this.featureModules.assertEnabled("remix", "api");
    const project = await this.getOwnedProject(user, id);
    const source = await this.storage.resolve(project.sourceSong.audioFile);
    const remixDir = path.join(this.uploadDir, "remixes");
    await fs.mkdir(remixDir, { recursive: true });
    const outputRelative = `remixes/${project.id}-${randomUUID()}.mp3`;
    const output = path.join(this.uploadDir, outputRelative);

    await this.prisma.remixProject.update({
      where: { id: project.id },
      data: { status: RemixJobStatus.PROCESSING, errorMessage: null },
    });

    const filters = this.buildFilters(project);
    const args = ["-y", "-i", source, "-vn", "-filter:a", filters, "-codec:a", "libmp3lame", "-q:a", "2", output];

    try {
      await this.runFfmpeg(args);
      return this.prisma.remixProject.update({
        where: { id: project.id },
        data: { status: RemixJobStatus.COMPLETED, outputFile: outputRelative, previewFile: outputRelative, errorMessage: null },
        include: { sourceSong: { include: { artist: true, genre: true } } },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Remix processing failed.";
      return this.prisma.remixProject.update({
        where: { id: project.id },
        data: { status: RemixJobStatus.FAILED, errorMessage: message },
        include: { sourceSong: { include: { artist: true, genre: true } } },
      });
    }
  }

  async resolvePreview(user: AuthenticatedUser, id: string) {
    const project = await this.getOwnedProject(user, id);
    if (!project.previewFile) throw new NotFoundException("Preview has not been generated.");
    return this.storage.resolve(project.previewFile);
  }

  async resolveDownload(user: AuthenticatedUser, id: string) {
    await this.featureModules.assertEnabled("remix", "api");
    await this.featureModules.assertEnabled("downloads", "api");
    await this.featureModules.assertEnabled("pro_plan", "api");
    const project = await this.getOwnedProject(user, id);
    if (!project.outputFile) throw new NotFoundException("Remix output has not been generated.");
    const filePath = await this.storage.resolve(project.outputFile);
    return { path: filePath, filename: `${project.slug}${path.extname(filePath) || ".mp3"}` };
  }

  async deleteProject(user: AuthenticatedUser, id: string) {
    await this.featureModules.assertEnabled("remix", "api");
    const project = await this.getOwnedProject(user, id);
    await this.prisma.remixProject.delete({ where: { id: project.id } });
    return { success: true };
  }

  private async getOwnedProject(user: AuthenticatedUser, id: string) {
    const project = await this.prisma.remixProject.findUnique({
      where: { id },
      include: { sourceSong: { include: { artist: true, genre: true } } },
    });
    if (!project) throw new NotFoundException("Remix project was not found.");
    if (user.role !== Role.ADMIN && project.userId !== user.userId) {
      throw new ForbiddenException("You cannot access this remix project.");
    }
    return project;
  }

  private buildFilters(project: { tempo: number; volume: number; bassBoost: number; trebleBoost: number; echo: number; reverb: number; pitchShift: number }) {
    const filters: string[] = [];
    if (project.pitchShift !== 0) {
      const ratio = Math.pow(2, project.pitchShift / 12);
      filters.push(`asetrate=44100*${ratio.toFixed(6)}`, "aresample=44100");
    }
    for (const tempo of this.tempoChain(project.tempo)) filters.push(`atempo=${tempo.toFixed(3)}`);
    filters.push(`volume=${this.clamp(project.volume, 0, 2).toFixed(3)}`);
    if (project.bassBoost > 0) filters.push(`equalizer=f=100:t=q:w=1:g=${project.bassBoost.toFixed(2)}`);
    if (project.trebleBoost > 0) filters.push(`equalizer=f=8000:t=q:w=1:g=${project.trebleBoost.toFixed(2)}`);
    if (project.echo > 0 || project.reverb > 0) {
      const echo = this.clamp(Math.max(project.echo, project.reverb), 0, 1);
      filters.push(`aecho=0.8:0.88:${Math.round(60 + echo * 120)}:${(0.15 + echo * 0.35).toFixed(2)}`);
    }
    return filters.join(",");
  }

  private tempoChain(value: number) {
    const chain: number[] = [];
    let remaining = this.clamp(value, 0.5, 2);
    while (remaining > 2) {
      chain.push(2);
      remaining /= 2;
    }
    while (remaining < 0.5) {
      chain.push(0.5);
      remaining /= 0.5;
    }
    chain.push(remaining);
    return chain;
  }

  private runFfmpeg(args: string[]) {
    return new Promise<void>((resolve, reject) => {
      const process = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
      let stderr = "";
      process.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      process.on("error", (error: NodeJS.ErrnoException) => {
        reject(new Error(error.code === "ENOENT" ? "ffmpeg is not installed on this server." : error.message));
      });
      process.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(stderr.trim() || "ffmpeg failed to process the remix."));
      });
    });
  }

  private async uniqueSlug(value: string) {
    const base = slugify(value) || "remix";
    let candidate = base;
    let index = 2;
    while (await this.prisma.remixProject.findUnique({ where: { slug: candidate } })) {
      candidate = `${base}-${index++}`;
    }
    return candidate;
  }

  private clamp(value: number, min: number, max: number) {
    if (!Number.isFinite(Number(value))) throw new BadRequestException("Invalid remix setting.");
    return Math.min(max, Math.max(min, Number(value)));
  }

  private clampInt(value: number, min: number, max: number) {
    return Math.round(this.clamp(value, min, max));
  }
}
