import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigVariables } from './service-config';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import pkg from '../package.json';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookie from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const conf = app.get(ConfigService<ConfigVariables>);
  const port = conf.get<number>('PORT') ?? 3000;

  const logger = new Logger('NestApplication', { timestamp: true });

  app.enableCors({
    origin: ['http://localhost:4000', 'http://localhost:3000'],
    exposedHeaders:
      'Authorization, X-Requested-With, Origin, Content-Type, Accept',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.use(cookie('secret2'));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );

  app.useLogger(logger);

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
  await app.listen(port).then(() => logger.log(`Listening on port ${port}`));
}

bootstrap();
