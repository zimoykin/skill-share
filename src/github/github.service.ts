import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ConfigVariables } from 'src/service-config';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);
  constructor(
    private readonly configService: ConfigService<ConfigVariables>,
    private readonly httpService: HttpService,
  ) {}

  async getNavigationLink() {
    const githubToken = this.configService.get<string>('GITHUB_PAT_TOKEN')!;
    const repo = this.configService.get<string>('GITHUB_REPO_NAME')!;
    const path = this.configService.get<string>('GITHUB_NAVIGATION')!;
    const owner = this.configService.get<string>('GITHUB_REPO_OWNER')!;

    const url = () =>
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const headers = {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github.v3.raw',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get(url(), { headers }),
      );
      this.logger.debug(`Fetched navigation link: ${response}`);
      const data = response.data;
      return data;
    } catch (error) {
      this.logger.error(`Error fetching navigation link: ${error.message}`);
      this.logger.debug(url());
      return null;
    }
  }
}
