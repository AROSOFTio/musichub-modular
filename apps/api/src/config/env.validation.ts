type EnvShape = {
  NODE_ENV?: string;
  PORT?: string;
  FRONTEND_URL?: string;
  DATABASE_URL?: string;
  JWT_SECRET?: string;
  JWT_REFRESH_SECRET?: string;
  ACCESS_TOKEN_TTL?: string;
  REFRESH_TOKEN_TTL?: string;
  REDIS_URL?: string;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_DISPLAY_NAME?: string;
  DEV_ADMIN_EMAIL?: string;
  DEV_ADMIN_PASSWORD?: string;
  DEV_ADMIN_DISPLAY_NAME?: string;
  UPLOAD_DIR?: string;
  SUPPORT_EMAIL_FROM?: string;
  SUPPORT_INBOUND_EMAIL?: string;
  SUPPORT_UPLOAD_MAX_BYTES?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASSWORD?: string;
};

export function validateEnv(config: EnvShape) {
  const required = ["DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET"] as const;

  for (const key of required) {
    if (!config[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    NODE_ENV: config.NODE_ENV || "development",
    PORT: Number(config.PORT || 4000),
    FRONTEND_URL: config.FRONTEND_URL || "http://localhost:4008",
    DATABASE_URL: config.DATABASE_URL,
    JWT_SECRET: config.JWT_SECRET,
    JWT_REFRESH_SECRET: config.JWT_REFRESH_SECRET,
    ACCESS_TOKEN_TTL: config.ACCESS_TOKEN_TTL || "15m",
    REFRESH_TOKEN_TTL: config.REFRESH_TOKEN_TTL || "7d",
    REDIS_URL: config.REDIS_URL || "redis://redis:6379",
    ADMIN_EMAIL: config.ADMIN_EMAIL,
    ADMIN_PASSWORD: config.ADMIN_PASSWORD,
    ADMIN_DISPLAY_NAME: config.ADMIN_DISPLAY_NAME || "Musichub Admin",
    DEV_ADMIN_EMAIL: config.DEV_ADMIN_EMAIL,
    DEV_ADMIN_PASSWORD: config.DEV_ADMIN_PASSWORD,
    DEV_ADMIN_DISPLAY_NAME: config.DEV_ADMIN_DISPLAY_NAME || "MusicHub Developer",
    UPLOAD_DIR: config.UPLOAD_DIR || "/app/uploads",
    SUPPORT_EMAIL_FROM: config.SUPPORT_EMAIL_FROM,
    SUPPORT_INBOUND_EMAIL: config.SUPPORT_INBOUND_EMAIL,
    SUPPORT_UPLOAD_MAX_BYTES: config.SUPPORT_UPLOAD_MAX_BYTES || "10485760",
    SMTP_HOST: config.SMTP_HOST,
    SMTP_PORT: config.SMTP_PORT || "587",
    SMTP_USER: config.SMTP_USER,
    SMTP_PASSWORD: config.SMTP_PASSWORD,
  };
}
