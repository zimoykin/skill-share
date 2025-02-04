import { Module } from '@nestjs/common';
import { AdminSettingsController } from './admin-settings.controller';
import { AdminSettingsService } from './admin-settings.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminSettingsController],
  providers: [AdminSettingsService],
})
export class AdminSettingsModule {}
