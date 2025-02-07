import { Module } from '@nestjs/common';
import { AdminSettingsController } from './admin-settings.controller';
import { AdminSettingsService } from './admin-settings.service';
import { AuthModule } from '../auth/auth.module';
import { GithubModule } from 'src/github/github.module';
import { RedisModule } from '@zimoykin/redis';

@Module({
  imports: [AuthModule, GithubModule, RedisModule.Cache()],
  controllers: [AdminSettingsController],
  providers: [AdminSettingsService],
})
export class AdminSettingsModule {}
