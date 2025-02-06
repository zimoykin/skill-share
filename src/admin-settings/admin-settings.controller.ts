import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AdminSettingsService } from './admin-settings.service';
import { JWTGuard } from '../github/jwt.guard';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { IAuthUser } from '../auth/interfaces/user.interface';

@Controller('admin-settings')
export class AdminSettingsController {
  private readonly logger = new Logger(AdminSettingsController.name);

  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @Get('nav-bar')
  @UseGuards(JWTGuard)
  async getNavbar(@AuthUser() user: IAuthUser) {
    return this.adminSettingsService.getNavbar(user.id).catch((err) => {
      this.logger.error(err);
      throw err;
    });
  }

  @Get('widgets')
  @UseGuards(JWTGuard)
  async getWidgets(@AuthUser() user: IAuthUser) {
    return this.adminSettingsService.getWidgets(user.id).catch((err) => {
      this.logger.error(err);
      throw err;
    });
  }
}
