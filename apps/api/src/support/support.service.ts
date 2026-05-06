import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(data: { name: string; email: string; subject?: string; message: string }) {
    return this.prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      },
    });
  }

  async listMessages() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getMessage(id: string) {
    return this.prisma.contactMessage.findUnique({
      where: { id },
    });
  }

  async updateMessage(id: string, data: { adminNote?: string; isReplied?: boolean }) {
    return this.prisma.contactMessage.update({
      where: { id },
      data,
    });
  }
}
