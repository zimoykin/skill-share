import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UsersController } from './users.controller';
import { Auth } from './entity/auth.entity';
import { GithubModule } from 'src/github/github.module';

@Module({
  imports: [GithubModule, TypeOrmModule.forFeature([User, Auth])],
  controllers: [AuthController, UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class AuthModule {}
