import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import {
  GitHubProfile,
  IUserGitHub,
} from '../auth/interfaces/github-user.interface';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  private readonly logger = new Logger(GithubStrategy.name);
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID')!,
      clientSecret: configService.get('GITHUB_CLIENT_SECRET')!,
      callbackURL: configService.get('GITHUB_CALLBACK_URL')!,
      scope: ['user:email'],
    });
  }

  async validate(
    token: string,
    _: string,
    profile: GitHubProfile,
  ): Promise<IUserGitHub> {
    this.logger.debug(JSON.stringify(profile));

    const avatar =
      Array.isArray(profile.photos) && profile.photos.length > 0
        ? profile.photos[0].value
        : '';

    const email =
      Array.isArray(profile.emails) && profile.emails.length > 0
        ? profile.emails[0].value
        : '';

    return {
      id: profile?.id ?? '',
      username: profile?.username ?? '',
      avatar,
      email,
      token,
      displayName: profile?.displayName ?? '',
    };
  }
}
