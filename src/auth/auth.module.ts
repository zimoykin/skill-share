import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubModule } from '../github/github.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), GithubModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
