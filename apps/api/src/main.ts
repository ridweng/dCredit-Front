import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

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

  const port = configService.get<number>('app.port', 3001);
  await app.listen(port);

  console.log(`\n🚀 dCredit API running on: http://localhost:${port}/api`);
  console.log(
    `   Environment: ${configService.get<string>('app.nodeEnv', 'development')}\n`,
  );
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to bootstrap dCredit API', error);
  process.exit(1);
});
