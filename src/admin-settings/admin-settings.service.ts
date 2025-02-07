import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserService } from '../auth/users.service';
import { UserRole } from '../auth/enums/user-role.enum';
import { Widget } from './interfaces/widget.interface';
import { GithubService } from '../github/github.service';
import { InjectCacheRedis, RedisCacheService } from '@zimoykin/redis';
import { INavLinkStaticData, NavLink } from './interfaces/nav-link.interface';

@Injectable()
export class AdminSettingsService {
  private readonly logger = new Logger(AdminSettingsService.name);

  constructor(
    private readonly userService: UserService,
    private readonly githubService: GithubService,
    @InjectCacheRedis() private readonly redisCacheService: RedisCacheService,
  ) {}
  async getNavbar(userId: string): Promise<NavLink> {
    const navCached = await this.redisCacheService.getValueByKey('nav-links');
    let navLins: INavLinkStaticData;
    const result: NavLink = {};

    if (!navCached) {
      this.logger.debug('getting nav links from cache');
      const links = await this.githubService.getNavigationLink();
      await this.redisCacheService.setValue(
        'nav-links',
        JSON.stringify(links),
        { expire: 1800 },
      );
      navLins = links;
    } else {
      this.logger.debug('getting nav links from cache');
      navLins = JSON.parse(navCached);
    }

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const sortedLinks = Object.values(navLins).sort((a, b) => a.sort - b.sort);

    sortedLinks.forEach((nav: INavLinkStaticData) => {
      if (typeof nav.link === 'string') {
        result[nav.title] = {
          title: nav.title,
          link: nav.link,
          disabled: nav.access === 'admin' && user.role !== UserRole.ADMIN,
        };
      } else {
        const nestedResult: NavLink = {};
        Object.values(nav.link).forEach((subNav: INavLinkStaticData) => {
          nestedResult[subNav.title] = {
            title: subNav.title,
            link: String(subNav.link),
            disabled: subNav.access === 'admin' && user.role !== UserRole.ADMIN,
          };
        });
        result[nav.title] = {
          title: nav.title,
          link: nestedResult,
          disabled: nav.access === 'admin' && user.role !== UserRole.ADMIN,
        };
      }
    });

    return result;
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

    const metrics = [
      {
        title: ' 📈 Metrics',
        link: '/statistics/metrics',
        disabled: true,
      },
    ];

    widgets.metrics = metrics;

    const history = [
      {
        title: ' 📖 History',
        link: '/statistics/history',
        disabled: true,
      },
    ];

    widgets.history = history;

    return widgets;
  }
}
