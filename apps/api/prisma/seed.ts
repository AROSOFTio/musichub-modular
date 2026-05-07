import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const featureModules = [
  ["core_catalog", "Core Catalog", "Core"],
  ["home", "Home", "Core"],
  ["search", "Search", "Core"],
  ["streaming", "Streaming", "Playback"],
  ["downloads", "Downloads", "Downloads"],
  ["remix", "Remix Studio", "Monetization"],
  ["pro_plan", "Pro Plan", "Monetization"],
  ["trending", "Trending", "Discovery"],
  ["latest", "Latest", "Discovery"],
  ["top50", "Top 50", "Discovery"],
  ["all_time", "All Time", "Discovery"],
  ["genres", "Genres", "Discovery"],
  ["artists", "Artists", "Discovery"],
  ["albums", "Albums", "Discovery"],
  ["hero_banners", "Hero Banners", "Discovery"],
  ["editor_picks", "Editor Picks", "Discovery"],
  ["popular_artists", "Popular Artists", "Discovery"],
  ["top_downloads", "Top Downloads", "Discovery"],
  ["continue_listening", "Continue Listening", "Playback"],
  ["browse_by_genre", "Browse by Genre", "Discovery"],
  ["playlists", "Playlists", "Library"],
  ["favorites", "Favorites", "Library"],
  ["library", "Library", "Library"],
  ["recently_played", "Recently Played", "Playback"],
  ["comments", "Comments", "Community"],
  ["likes", "Likes", "Community"],
  ["follows", "Follows", "Community"],
  ["notifications", "Notifications", "Community"],
  ["user_registration", "User Registration", "Community"],
  ["artist_registration", "Artist Registration", "Community"],
  ["contact_support", "Contact Support", "Community"],
  ["advertising_requests", "Advertising Requests", "Community"],
  ["song_requests", "Song Requests", "Community"],
  ["song_removal_requests", "Song Removal Requests", "Community"],
  ["upload", "Upload", "Upload"],
  ["admin_dashboard", "Admin Dashboard", "Admin"],
  ["admin_songs", "Admin Songs", "Admin"],
  ["admin_artists", "Admin Artists", "Admin"],
  ["admin_genres", "Admin Genres", "Admin"],
  ["admin_albums", "Admin Albums", "Admin"],
  ["admin_music_types", "Admin Music Types", "Admin"],
  ["admin_hero_banners", "Admin Hero Banners", "Admin"],
  ["admin_editor_picks", "Admin Editor Picks", "Admin"],
  ["admin_trending", "Admin Trending", "Admin"],
  ["admin_users", "Admin Users", "Admin"],
  ["admin_messages", "Admin Messages", "Admin"],
  ["admin_modules", "Admin Modules", "Admin"],
  ["admin_settings", "Admin Settings", "Admin"],
] as const;

const coreModules = new Set(["core_catalog", "home", "admin_modules", "admin_settings"]);
const defaultDisabledModules = new Set(["pro_plan"]);

const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    featureModules.map(([key, name, category], sortOrder) =>
      prisma.featureModule.upsert({
        where: { key },
        update: { name, category, sortOrder, isCore: coreModules.has(key) },
        create: {
          key,
          name,
          category,
          description: `${name} feature module.`,
          sortOrder,
          isCore: coreModules.has(key),
          enabledPublic: !defaultDisabledModules.has(key),
          enabledAdmin: !defaultDisabledModules.has(key),
        },
      }),
    ),
  );

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  const adminDisplayName =
    process.env.ADMIN_DISPLAY_NAME?.trim() || "Musichub Admin";
  const devAdminEmail = process.env.DEV_ADMIN_EMAIL?.trim().toLowerCase();
  const devAdminPassword = process.env.DEV_ADMIN_PASSWORD?.trim();
  const devAdminDisplayName =
    process.env.DEV_ADMIN_DISPLAY_NAME?.trim() || "MusicHub Developer";

  if (!adminEmail || !adminPassword) {
    console.warn(
      "Admin seed skipped because ADMIN_EMAIL or ADMIN_PASSWORD is missing.",
    );
  } else {
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

  if (devAdminEmail && devAdminPassword) {
    const devPasswordHash = await bcrypt.hash(devAdminPassword, 12);
    await prisma.user.upsert({
      where: { email: devAdminEmail },
      update: {
        displayName: devAdminDisplayName,
        passwordHash: devPasswordHash,
        role: Role.DEV_ADMIN,
      },
      create: {
        email: devAdminEmail,
        displayName: devAdminDisplayName,
        passwordHash: devPasswordHash,
        role: Role.DEV_ADMIN,
      },
    });

    console.info(`Developer admin seed complete for ${devAdminEmail}.`);
  }
}

main()
  .catch((error) => {
    console.error("Admin seed failed.", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

