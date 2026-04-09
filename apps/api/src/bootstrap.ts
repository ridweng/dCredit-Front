import { INestApplication, RequestMethod, Type, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

interface BootstrapOptions {
  rootModule: Type<unknown>;
  docsTitle: string;
  docsDescription: string;
  docsPath?: string;
  globalPrefix?: string;
  globalPrefixExclude?: Array<{ path: string; method: RequestMethod }>;
  defaultPort: number;
  publicBasePath: string;
}

export async function bootstrapBackendApp(
  options: BootstrapOptions,
): Promise<INestApplication> {
  const app = await NestFactory.create(options.rootModule);
  const configService = app.get(ConfigService);

  if (options.globalPrefix) {
    app.setGlobalPrefix(options.globalPrefix, {
      exclude: options.globalPrefixExclude ?? [],
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: configService.get<string[]>('app.corsOrigins'),
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle(options.docsTitle)
    .setDescription(options.docsDescription)
    .setVersion('0.4.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(options.docsPath ?? 'api/docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('app.port', options.defaultPort);
  await app.listen(port);

  console.log(`\n🚀 ${options.docsTitle} running on: http://localhost:${port}${options.publicBasePath}`);
  console.log(
    `📘 Swagger docs available at: http://localhost:${port}/${options.docsPath ?? 'api/docs'}`,
  );
  console.log(
    `   Environment: ${configService.get<string>('app.nodeEnv', 'development')}\n`,
  );

  return app;
}
