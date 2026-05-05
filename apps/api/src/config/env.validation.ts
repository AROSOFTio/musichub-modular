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
  };
}
