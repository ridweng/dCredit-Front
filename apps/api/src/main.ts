import { NestFactory } from '@nestjs/core';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'admin', method: RequestMethod.ALL },
      { path: 'admin/(.*)', method: RequestMethod.ALL },
    ],
  });

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
    .setTitle('dCredit API')
    .setDescription(
      'dCredit API for authentication, dashboard, credits, spending, sources, profile, and internal admin operations.',
    )
    .setVersion('0.3.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('app.port', 3001);
  await app.listen(port);

  console.log(`\n🚀 dCredit API running on: http://localhost:${port}/api`);
  console.log(`📘 Swagger docs available at: http://localhost:${port}/api/docs`);
  console.log(
    `   Environment: ${configService.get<string>('app.nodeEnv', 'development')}\n`,
  );
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to bootstrap dCredit API', error);
  process.exit(1);
});
