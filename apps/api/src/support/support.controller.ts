import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { Role, SupportTicketStatus } from "@prisma/client";

import { AuthenticatedUser, CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { SupportService } from "./support.service";

const supportFiles = FileFieldsInterceptor([
  { name: "advertImage", maxCount: 1 },
  { name: "proofAttachment", maxCount: 1 },
  { name: "attachment", maxCount: 1 },
], { limits: { fileSize: 10 * 1024 * 1024 } });

@Controller("support")
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post("contact")
  @UseInterceptors(supportFiles)
  submitContact(@Body() body: Record<string, string>, @UploadedFiles() files: Record<string, any[]>) {
    return this.supportService.createTicket(body, files ?? {});
  }

  @Get("admin/tickets")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEV_ADMIN, Role.EDITOR)
  listTickets(@Query("status") status?: string, @Query("category") category?: string, @Query("assignedToId") assignedToId?: string) {
    return this.supportService.listTickets({ status, category, assignedToId });
  }

  @Get("admin/tickets/assignees")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEV_ADMIN, Role.EDITOR)
  listAssignees() {
    return this.supportService.listAssignableUsers();
  }

  @Get("admin/tickets/:id")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEV_ADMIN, Role.EDITOR)
  getTicket(@Param("id") id: string) {
    return this.supportService.getTicket(id);
  }

  @Post("admin/tickets/:id/reply")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEV_ADMIN, Role.EDITOR)
  reply(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: { message?: string }) {
    return this.supportService.reply(user, id, body);
  }

  @Patch("admin/tickets/:id/assign")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEV_ADMIN, Role.EDITOR)
  assign(@Param("id") id: string, @Body("assignedToId") assignedToId?: string | null) {
    return this.supportService.assign(id, assignedToId || null);
  }

  @Patch("admin/tickets/:id/status")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DEV_ADMIN, Role.EDITOR)
  setStatus(@Param("id") id: string, @Body("status") status: SupportTicketStatus) {
    return this.supportService.setStatus(id, status);
  }
}
