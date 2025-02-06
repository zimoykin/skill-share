import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserService } from '../auth/users.service';
import { NavLink } from './interfaces/nav-link.interface';
import { UserRole } from '../auth/enums/user-role.enum';
import { Widget } from './interfaces/widget.interface';

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
        skills: '/catalogs/skills',
        categories: '/catalogs/categories',
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

  async getWidgets(userId: string) {
    const user = await this.userService.findUserById(userId);
    const widgets: Widget = {};

    const widgetsAbout = [
      {
        title: ' 🦄 Our mission',
        link: '/about',
        disabled: false,
      },
      {
        title: ' ☎️ Contact Us',
        link: '/contact',
        disabled: false,
      },
    ];

    widgets.about = widgetsAbout;

    if (user) {
      const widgetsCatalogs = [
        {
          title: ' 🧑‍🔧 Skills',
          link: '/catalogs/skills',
          disabled: false,
        },
      ];
      widgetsCatalogs.push({
        title: ' 📚 Categories',
        link: '/catalogs/categories',
        disabled: false,
      });
      if (user?.role === UserRole.ADMIN) {
        widgetsCatalogs?.push({
          title: ' 👤 Users',
          link: '/users',
          disabled: user.role !== UserRole.ADMIN,
        });
      }

      widgets.catalogs = widgetsCatalogs;
    }

    return widgets;
  }
}
