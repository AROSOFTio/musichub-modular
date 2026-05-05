import "reflect-metadata";

import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const frontendUrl =
    configService.get<string>("FRONTEND_URL") ?? "http://localhost:4008";
  const allowedOrigins = frontendUrl
    .split(",")
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter(Boolean);

  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.enableCors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin?.replace(/\/$/, "");

      if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed."), false);
    },
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = configService.get<number>("PORT") ?? 4000;
  await app.listen(port, "0.0.0.0");
}

bootstrap();
