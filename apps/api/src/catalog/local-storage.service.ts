import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

type StoredFile = {
  relativePath: string;
  publicUrl: string;
  absolutePath: string;
};

type UploadedFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
};

const AUDIO_TYPES = new Set(["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav"]);
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

@Injectable()
export class LocalStorageService {
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = this.configService.get<string>("UPLOAD_DIR") ?? "/app/uploads";
  }

  async saveAudio(file?: UploadedFile): Promise<StoredFile> {
    if (!file) {
      throw new BadRequestException("Audio file is required.");
    }

    if (!AUDIO_TYPES.has(file.mimetype)) {
      throw new BadRequestException("Only MP3 and WAV audio files are supported.");
    }

    return this.saveFile("audio", file);
  }

  async saveCover(file?: UploadedFile): Promise<StoredFile | null> {
    if (!file) {
      return null;
    }

    if (!IMAGE_TYPES.has(file.mimetype)) {
      throw new BadRequestException("Cover image must be JPG, PNG, or WebP.");
    }

    return this.saveFile("covers", file);
  }

  async resolve(relativePath: string) {
    const safePath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
    const absolutePath = path.join(this.uploadDir, safePath);
    const relativeToRoot = path.relative(this.uploadDir, absolutePath);

    if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
      throw new NotFoundException("File was not found.");
    }

    try {
      await fs.access(absolutePath);
    } catch {
      throw new NotFoundException("File was not found.");
    }

    return absolutePath;
  }

  private async saveFile(kind: "audio" | "covers", file: UploadedFile) {
    const directory = path.join(this.uploadDir, kind);
    await fs.mkdir(directory, { recursive: true });

    const extension = this.extensionFor(file);
    const filename = `${Date.now()}-${randomUUID()}${extension}`;
    const absolutePath = path.join(directory, filename);
    await fs.writeFile(absolutePath, file.buffer);

    const relativePath = `${kind}/${filename}`;
    return {
      relativePath,
      publicUrl: `/api/uploads/${relativePath}`,
      absolutePath,
    };
  }

  private extensionFor(file: UploadedFile) {
    const originalExtension = path.extname(file.originalname).toLowerCase();
    if (originalExtension && originalExtension.length <= 8) {
      return originalExtension;
    }

    if (file.mimetype === "audio/wav" || file.mimetype === "audio/x-wav") {
      return ".wav";
    }

    if (file.mimetype.startsWith("image/")) {
      return `.${file.mimetype.replace("image/", "")}`;
    }

    return ".mp3";
  }
}
