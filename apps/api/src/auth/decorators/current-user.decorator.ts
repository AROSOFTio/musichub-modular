import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Role } from "@prisma/client";

export type AuthenticatedUser = {
  userId: string;
  email: string;
  role: Role;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);

