import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigVariables } from './service-config';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import pkg from '../package.json';
import session from 'express-session';
import passport from 'passport';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const conf = app.get(ConfigService<ConfigVariables>);
  const port = conf.get<number>('PORT') ?? 3000;

  const logger = new Logger('NestApplication');

  app.use(
    session({
      secret: conf.get('SESSION_SECRET') || 'default_secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: '*',
    exposedHeaders:
      'Authorization, X-Requested-With, Origin, Content-Type, Accept',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

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
