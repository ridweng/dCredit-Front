import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Global validation pipe — transforms and validates incoming DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS — configure to match your web/mobile origins in production
  app.enableCors({
    origin: [
      process.env.WEB_URL ?? 'http://localhost:5173',
      'http://localhost:19000', // Expo dev client
      'http://localhost:19006', // Expo web
    ],
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`\n🚀 dCredit API running on: http://localhost:${port}/api`);
  console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}\n`);
}

bootstrap();
