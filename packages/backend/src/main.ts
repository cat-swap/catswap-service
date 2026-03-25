import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger as PinoLogger } from 'nestjs-pino';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    rawBody: true,
    bufferLogs: true,
  });

  app.useLogger(app.get(PinoLogger));
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger API Documentation
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('CatSwap API')
      .setDescription('API documentation for CatSwap DEX')
      .setVersion('1.0.0')
      .addTag('swap', 'Token swap operations')
      .addTag('pools', 'Liquidity pool operations')
      .addTag('health', 'Health check endpoints')
      .addServer('http://localhost:3001', 'Development server')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
      customSiteTitle: 'CatSwap API Documentation',
      customCss: '.swagger-ui .topbar { display: none }',
    });
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = configService.get<number>('PORT', 3001);
  const host = configService.get<string>('HOST', '0.0.0.0');

  await app.listen(port, host);

  logger.log(`🚀 CatSwap API is running on: http://${host}:${port}`);
  if (!isProduction) {
    logger.log(`📚 API Documentation: http://${host}:${port}/api-docs`);
  }
}

bootstrap();
