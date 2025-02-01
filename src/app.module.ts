import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ConfigVariables, serviceSchema } from './service-config';
import { SkillsModule } from './skills/skills.module';
import { Skill } from './skills/entities/skill.entity';
import { JwtModule } from '@zimoykin/auth';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entity/category.entity';
import { AuthModule } from './auth/auth.module';
import { GithubModule } from './github/github.module';
import { User } from './auth/entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: serviceSchema,
    }),
    JwtModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<ConfigVariables>) => {
        return {
          secret: config.get('JWT_SECRET')!,
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<ConfigVariables>) => {
        return {
          type: 'mariadb',
          host: config.get<string>('DB_CONNECTION')!,
          port: config.get<number>('DB_PORT')!,
          username: config.get<string>('DB_USERNAME')!,
          password: config.get<string>('DB_PASSWORD')!,
          database: config.get<string>('DB_DATABASE')!,
          synchronize: process.env.NODE_ENV !== 'prod',
          entities: [Skill, Category, User],
        };
      },
    }),
    SkillsModule,
    CategoriesModule,
    AuthModule,
    GithubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
