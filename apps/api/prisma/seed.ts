import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  const adminDisplayName =
    process.env.ADMIN_DISPLAY_NAME?.trim() || "Musichub Admin";

  if (!adminEmail || !adminPassword) {
    console.warn(
      "Admin seed skipped because ADMIN_EMAIL or ADMIN_PASSWORD is missing.",
    );
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      displayName: adminDisplayName,
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      displayName: adminDisplayName,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.info(`Admin seed complete for ${adminEmail}.`);
}

main()
  .catch((error) => {
    console.error("Admin seed failed.", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

