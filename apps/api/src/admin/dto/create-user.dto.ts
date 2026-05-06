import { Role } from "@prisma/client";

export class CreateUserDto {
  email: string;
  password?: string;
  displayName: string;
  username?: string;
  role: Role;
}
