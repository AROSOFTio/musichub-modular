import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailDeliveryStatus, Role, SupportMessageAuthorType, SupportTicketCategory, SupportTicketStatus } from "@prisma/client";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { AuthenticatedUser } from "../auth/decorators/current-user.decorator";
import { FeatureModulesService } from "../feature-modules/feature-modules.service";
import { PrismaService } from "../prisma/prisma.service";

type UploadedSupportFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const DOCUMENT_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
const ATTACHMENT_TYPES = new Set([...DOCUMENT_TYPES, "text/plain"]);

const CATEGORY_MODULES: Record<SupportTicketCategory, string | null> = {
  ADVERTISE: "advertising_requests",
  SONG_REQUEST: "song_requests",
  SONG_REMOVAL: "song_removal_requests",
  OTHER: null,
};

@Injectable()
export class SupportService {
  private readonly uploadDir: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly featureModules: FeatureModulesService,
  ) {
    this.uploadDir = this.config.get<string>("UPLOAD_DIR") ?? "/app/uploads";
  }

  async createTicket(body: Record<string, string>, files: Record<string, UploadedSupportFile[] | undefined>) {
    await this.featureModules.assertEnabled("contact_support", "api");
    const category = this.categoryFrom(body.category);
    const moduleKey = CATEGORY_MODULES[category];
    if (moduleKey) await this.featureModules.assertEnabled(moduleKey, "api");

    this.validateTicket(category, body, files);
    const requester = this.requesterFor(category, body);
    const subject = this.subjectFor(category, body);
    const message = this.messageFor(category, body);
    const emailStatus = this.initialEmailStatus();

    const ticket = await this.prisma.supportTicket.create({
      data: {
        category,
        subject,
        requesterName: requester.name,
        requesterEmail: requester.email,
        requesterPhone: requester.phone || null,
        metadata: this.metadataFor(category, body),
        emailDeliveryStatus: emailStatus,
        messages: {
          create: {
            authorType: SupportMessageAuthorType.REQUESTER,
            authorName: requester.name,
            authorEmail: requester.email,
            body: message,
            emailDeliveryStatus: emailStatus,
          },
        },
      },
      include: { messages: true },
    });

    const firstMessage = ticket.messages[0];
    await this.saveAttachments(ticket.id, firstMessage.id, category, files);
    await this.prisma.inboundEmailMapping.create({
      data: { ticketId: ticket.id, replyToken: randomUUID(), inboundEmail: this.config.get<string>("SUPPORT_INBOUND_EMAIL") || null },
    });

    return this.getTicket(ticket.id);
  }

  async listTickets(query: { status?: string; category?: string; assignedToId?: string }) {
    await this.featureModules.assertEnabled("contact_support", "api");
    return this.prisma.supportTicket.findMany({
      where: {
        status: this.optionalStatus(query.status),
        category: this.optionalCategory(query.category),
        assignedToId: query.assignedToId || undefined,
      },
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: { select: { id: true, displayName: true, email: true } },
        _count: { select: { messages: true, attachments: true } },
      },
    });
  }

  async getTicket(id: string) {
    await this.featureModules.assertEnabled("contact_support", "api");
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, displayName: true, email: true } },
        messages: { orderBy: { createdAt: "asc" }, include: { attachments: true, adminUser: { select: { id: true, displayName: true, email: true } } } },
        attachments: true,
        inboundMappings: true,
      },
    });
    if (!ticket) throw new NotFoundException("Support ticket not found.");
    return ticket;
  }

  async reply(user: AuthenticatedUser, id: string, body: { message?: string }) {
    await this.featureModules.assertEnabled("contact_support", "api");
    const ticket = await this.getTicket(id);
    const message = body.message?.trim();
    if (!message) throw new BadRequestException("Reply message is required.");
    const status = this.initialEmailStatus();
    await this.prisma.supportMessage.create({
      data: {
        ticketId: ticket.id,
        authorType: SupportMessageAuthorType.ADMIN,
        adminUserId: user.userId,
        authorName: user.email,
        authorEmail: this.supportFromAddress(),
        body: message,
        emailDeliveryStatus: status,
      },
    });
    await this.prisma.supportTicket.update({
      where: { id },
      data: { status: SupportTicketStatus.AWAITING_USER, emailDeliveryStatus: status },
    });
    return this.getTicket(id);
  }

  async assign(id: string, assignedToId: string | null) {
    await this.featureModules.assertEnabled("contact_support", "api");
    if (assignedToId) {
      const user = await this.prisma.user.findFirst({
        where: { id: assignedToId, role: { in: [Role.ADMIN, Role.DEV_ADMIN, Role.EDITOR] } },
      });
      if (!user) throw new BadRequestException("Assigned user was not found.");
    }
    await this.prisma.supportTicket.update({ where: { id }, data: { assignedToId } });
    return this.getTicket(id);
  }

  async setStatus(id: string, status: SupportTicketStatus) {
    await this.featureModules.assertEnabled("contact_support", "api");
    await this.prisma.supportTicket.update({
      where: { id },
      data: { status, closedAt: [SupportTicketStatus.CLOSED, SupportTicketStatus.RESOLVED].includes(status) ? new Date() : null },
    });
    return this.getTicket(id);
  }

  async listAssignableUsers() {
    await this.featureModules.assertEnabled("contact_support", "api");
    return this.prisma.user.findMany({
      where: { role: { in: [Role.ADMIN, Role.DEV_ADMIN, Role.EDITOR] } },
      orderBy: { displayName: "asc" },
      select: { id: true, displayName: true, email: true, role: true },
    });
  }

  private categoryFrom(value?: string) {
    const normalized = value?.toUpperCase();
    if (normalized === "ADVERTISE") return SupportTicketCategory.ADVERTISE;
    if (normalized === "SONG_REQUEST") return SupportTicketCategory.SONG_REQUEST;
    if (normalized === "SONG_REMOVAL") return SupportTicketCategory.SONG_REMOVAL;
    if (normalized === "OTHER") return SupportTicketCategory.OTHER;
    throw new BadRequestException("Invalid support category.");
  }

  private optionalCategory(value?: string) {
    return value ? this.categoryFrom(value) : undefined;
  }

  private optionalStatus(value?: string) {
    if (!value) return undefined;
    const normalized = value.toUpperCase();
    if (Object.values(SupportTicketStatus).includes(normalized as SupportTicketStatus)) return normalized as SupportTicketStatus;
    return undefined;
  }

  private validateTicket(category: SupportTicketCategory, body: Record<string, string>, files: Record<string, UploadedSupportFile[] | undefined>) {
    const required = (key: string) => {
      if (!body[key]?.trim()) throw new BadRequestException(`${key} is required.`);
    };
    if (category === SupportTicketCategory.ADVERTISE) {
      ["businessName", "contactPersonName", "contactEmail", "contactPhone", "advertType", "businessDetails", "campaignDetails"].forEach(required);
      this.validateFiles(files.advertImage, IMAGE_TYPES, "Advert image");
    } else if (category === SupportTicketCategory.SONG_REQUEST) {
      ["requesterName", "requesterEmail", "artistName", "songTitle", "message"].forEach(required);
    } else if (category === SupportTicketCategory.SONG_REMOVAL) {
      ["requesterName", "requesterEmail", "artistName", "songTitle", "removalReason"].forEach(required);
      if (body.confirmRights !== "true") throw new BadRequestException("Rights confirmation is required.");
      this.validateFiles(files.proofAttachment, DOCUMENT_TYPES, "Proof attachment");
    } else {
      ["name", "email", "subject", "message"].forEach(required);
      this.validateFiles(files.attachment, ATTACHMENT_TYPES, "Attachment", false);
    }
  }

  private validateFiles(files: UploadedSupportFile[] | undefined, allowed: Set<string>, label: string, required = true) {
    if (!files?.length) {
      if (required) throw new BadRequestException(`${label} is required.`);
      return;
    }
    for (const file of files) {
      if (!allowed.has(file.mimetype)) throw new BadRequestException(`${label} type is not supported.`);
      if (file.size > this.maxUploadBytes()) throw new BadRequestException(`${label} is too large.`);
    }
  }

  private requesterFor(category: SupportTicketCategory, body: Record<string, string>) {
    if (category === SupportTicketCategory.ADVERTISE) {
      return { name: body.contactPersonName, email: body.contactEmail, phone: body.contactPhone };
    }
    if (category === SupportTicketCategory.OTHER) {
      return { name: body.name, email: body.email, phone: body.phone };
    }
    return { name: body.requesterName, email: body.requesterEmail, phone: body.requesterPhone };
  }

  private subjectFor(category: SupportTicketCategory, body: Record<string, string>) {
    if (category === SupportTicketCategory.ADVERTISE) return `Advertise: ${body.businessName}`;
    if (category === SupportTicketCategory.SONG_REQUEST) return `Song request: ${body.artistName} - ${body.songTitle}`;
    if (category === SupportTicketCategory.SONG_REMOVAL) return `Song removal: ${body.artistName} - ${body.songTitle}`;
    return body.subject;
  }

  private messageFor(category: SupportTicketCategory, body: Record<string, string>) {
    if (category === SupportTicketCategory.ADVERTISE) return body.campaignDetails;
    if (category === SupportTicketCategory.SONG_REMOVAL) return body.removalReason;
    return body.message;
  }

  private metadataFor(category: SupportTicketCategory, body: Record<string, string>) {
    const copy = { ...body };
    delete copy.message;
    delete copy.campaignDetails;
    delete copy.removalReason;
    delete copy.confirmRights;
    copy.category = category;
    return copy;
  }

  private async saveAttachments(ticketId: string, messageId: string, category: SupportTicketCategory, files: Record<string, UploadedSupportFile[] | undefined>) {
    const allFiles = [
      ...(files.advertImage ?? []),
      ...(files.proofAttachment ?? []),
      ...(files.attachment ?? []),
    ];
    for (const file of allFiles) {
      const relativePath = await this.saveFile(file);
      await this.prisma.supportAttachment.create({
        data: { ticketId, messageId, filename: file.originalname, mimeType: file.mimetype, size: file.size, filePath: relativePath },
      });
    }
  }

  private async saveFile(file: UploadedSupportFile) {
    const directory = path.join(this.uploadDir, "support");
    await fs.mkdir(directory, { recursive: true });
    const extension = path.extname(file.originalname).slice(0, 10) || ".bin";
    const filename = `${Date.now()}-${randomUUID()}${extension}`;
    await fs.writeFile(path.join(directory, filename), file.buffer);
    return `support/${filename}`;
  }

  private supportFromAddress() {
    const explicit = this.config.get<string>("SUPPORT_EMAIL_FROM");
    if (explicit) return explicit;
    const appUrl = this.config.get<string>("FRONTEND_URL") || this.config.get<string>("NEXT_PUBLIC_APP_URL") || "";
    try {
      const domain = new URL(appUrl).hostname;
      return `support@${domain}`;
    } catch {
      return "support@localhost";
    }
  }

  private initialEmailStatus() {
    return this.config.get<string>("SMTP_HOST") ? EmailDeliveryStatus.PENDING : EmailDeliveryStatus.NOT_CONFIGURED;
  }

  private maxUploadBytes() {
    return Number(this.config.get<string>("SUPPORT_UPLOAD_MAX_BYTES") ?? 10 * 1024 * 1024);
  }
}
