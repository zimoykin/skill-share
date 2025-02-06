import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigVariables } from './service-config';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import pkg from '../package.json';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import cookie from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const conf = app.get(ConfigService<ConfigVariables>);
  const port = conf.get<number>('PORT') ?? 3000;

  app.enableCors({
    origin: ['http://localhost:4000', 'http://localhost:3000'],
    exposedHeaders:
      'Authorization, X-Requested-With, Origin, Content-Type, Accept',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.use(cookie(conf.get('COOKIE_SECRET')!));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );

  app.useLogger(app.get(Logger));

  // swagger config
  const config = new DocumentBuilder()
    .setTitle(pkg.name ?? 'Service Api')
    .setDescription(
      pkg.description ?? 'This service based on nestjs-template-10',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('specs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // launch app
  await app.listen(port);
  app.get(Logger).log(`Listening on port ${port}`);
}

bootstrap();
