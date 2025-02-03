import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigVariables } from '../service-config';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { IUserGitHub } from './interfaces/github-user.interface';
import { UserRole } from './enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './entity/auth.entity';
import { IAuthUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly configService: ConfigService<ConfigVariables>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Finds a user by their unique identifier.
   * @param userId The unique identifier of the user.
   * @returns A promise that resolves to the user if found, otherwise null.
   */

  async findUserById(userId: string) {
    return this.usersRepository.findOneBy({ id: userId });
  }
  async checkAndValidateToken(refreshToken: string) {
    try {
      // verify the tokens
      const { id } = await this.jwt.verify(refreshToken, {
        secret: this.configService.get('JWT_SECRET')!,
      });
      // check if the token is valid
      const auth = await this.authRepository.findOne({
        where: {
          userId: id,
          token: refreshToken,
        },
      });
      if (!auth) {
        throw new Error('Invalid token');
      }

      return auth;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Invalid token');
    }
  }
  /**
   * Finds all users in the database.
   * @returns {Promise<User[]>} A promise that resolves to an array of users.
   */
  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }
  /**
   * Returns the URL of the frontend page where the user is redirected
   * after successful GitHub authentication.
   * @returns {Promise<string>} The URL of the frontend page.
   */
  async getFrontendURlPage(): Promise<string> {
    return this.configService.get('FRONTEND_GITHUB_AUTH_PAGE')!;
  }

  /**
   * Finds a user by their GitHub ID.
   * If the user is not found, the method returns null.
   * If the user is found, the method returns the user and their JWT tokens.
   * @param gitHubId The GitHub ID to search for.
   * @returns A promise that resolves to the user and their JWT tokens, or null if the user is not found.
   */
  async findUserByGitHubId(gitHubId: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        gitHubId,
      },
    });

    if (!user) {
      return null;
    }
    return user;
  }

  /**
   * Creates a new user based on the information from GitHub.
   * If a user with the same GitHub ID already exists, the method returns null.
   * If the user is created, the method returns the created user and their JWT tokens.
   * @param user The information about the user from GitHub.
   * @returns A promise that resolves to the created user and their JWT tokens, or null if the user already exists.
   */
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
    const createdUser = await this.usersRepository.save(newUser);
    return createdUser;
  }

  /**
   * Generates a pair of JSON Web Tokens for the given user.
   * The tokens are signed with the secret key specified in the configuration.
   * The access token expires after 1 hour, and the refresh token expires after 7 days.
   * The refresh token is also stored in the database, and is overwritten each time a new
   * pair of tokens is generated for the user.
   * @param user The user for which to generate the tokens.
   * @returns A promise that resolves to an object containing the access token and the refresh token.
   */
  async generateTokens(user: IAuthUser) {
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      gitHubId: user.gitHubId,
    } as IAuthUser;

    const tokens = {
      accessToken: await this.jwt.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET')!,
        expiresIn: '10m',
      }),
      refreshToken: await this.jwt.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET')!,
        expiresIn: '7d',
      }),
    };

    const auth = this.authRepository.create({
      token: tokens.refreshToken,
      userId: user.id,
    });
    await this.authRepository.delete({ userId: user.id });
    await this.authRepository.save(auth);

    return tokens;
  }

  async logout(userId: string, cb: () => void) {
    await this.authRepository.delete({ userId });
    cb();
  }
}
