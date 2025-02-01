import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigVariables } from '../service-config';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { IUserGitHub } from './interfaces/github-user.interface';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly configService: ConfigService<ConfigVariables>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getFrontendURlPage() {
    return this.configService.get('FRONTEND_GITHUB_AUTH_PAGE')!;
  }

  async findUserByGitHubId(gitHubId: string) {
    return this.usersRepository.findOne({
      where: {
        gitHubId,
      },
    });
  }

  async createUserByGitHub(user: IUserGitHub) {
    const newUser = this.usersRepository.create({
      gitHubId: user.id,
      username: user.username,
      avatar: user.avatar,
      role: UserRole.USER,
      token: user.token,
      email: user.email,
      displayName: user.displayName,
    });
    return this.usersRepository.save(newUser);
  }
}
