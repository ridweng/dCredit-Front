import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import pinoHttp from "pino-http";
import { AppModule } from "./app.module";
import { logger } from "./lib/logger";

async function bootstrap() {
  const rawPort = process.env["PORT"];

  if (!rawPort) {
    throw new Error(
      "PORT environment variable is required but was not provided.",
    );
  }

  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.use(
    pinoHttp({
      logger,
      serializers: {
        req(req) {
          return {
            id: req.id,
            method: req.method,
            url: req.url?.split("?")[0],
          };
        },
        res(res) {
          return {
            statusCode: res.statusCode,
          };
        },
      },
    }),
  );
  app.enableCors();
  app.setGlobalPrefix("api");

  await app.listen(port);
  logger.info({ port }, "Server listening");
}

bootstrap().catch((err: unknown) => {
  logger.error({ err }, "Error starting server");
  process.exit(1);
});
