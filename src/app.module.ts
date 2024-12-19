import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ConfigVariables, serviceSchema } from './service-config';
import { SkillsModule } from './skills/skills.module';
import { Skill } from './skills/entities/skill.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: serviceSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<ConfigVariables>) => {
        return {
          type: 'mysql',
          host: config.get<string>('DB_CONNECTION')!,
          port: config.get<number>('DB_PORT')!,
          username: config.get<string>('DB_USERNAME')!,
          password: config.get<string>('DB_PASSWORD')!,
          database: config.get<string>('DB_DATABASE')!,
          synchronize: process.env.NODE_ENV !== 'prod',
          entities: [Skill],
        };
      },
    }),
    SkillsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
