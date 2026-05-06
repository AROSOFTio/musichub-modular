import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { SupportService } from "./support.service";

@Controller("support")
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post("contact")
  submitContact(@Body() body: { name: string; email: string; subject?: string; message: string }) {
    return this.supportService.createMessage(body);
  }

  @Get("admin/messages")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  listMessages() {
    return this.supportService.listMessages();
  }

  @Get("admin/messages/:id")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getMessage(@Param("id") id: string) {
    return this.supportService.getMessage(id);
  }

  @Patch("admin/messages/:id")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateMessage(
    @Param("id") id: string,
    @Body() body: { adminNote?: string; isReplied?: boolean },
  ) {
    return this.supportService.updateMessage(id, body);
  }
}
