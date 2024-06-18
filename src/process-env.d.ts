declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    PORT?: number;
    JWT_SECRET: string;
    JWT_EXPIRES: string;
  }
}
