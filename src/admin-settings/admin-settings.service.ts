import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserService } from '../auth/users.service';
import { NavLink } from './interfaces/nav-link.interface';
import { UserRole } from 'src/auth/enums/user-role.enum';

@Injectable()
export class AdminSettingsService {
  private readonly logger = new Logger(AdminSettingsService.name);

  constructor(private readonly userService: UserService) {}
  async getNavbar(userId: string): Promise<NavLink> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const nav: NavLink = {
      home: '/',
      catalogs: {
        skills: '/skills',
        categories: '/categories',
      },
    };

    if (user.role === UserRole.ADMIN) {
      nav['users'] = {
        list: '/users',
        create: '/users/create',
      };
    }

    nav['about'] = '/about';
    nav['contact'] = '/contact';

    return nav;
  }
}
