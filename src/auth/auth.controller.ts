import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { Request, Response } from 'express';
import { IUserGitHub } from './interfaces/github-user.interface';
import { plainToInstance } from 'class-transformer';
import { UserOutDTO } from './dtos/user-out-dto';
import { UserRole } from './enums/user-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from './decorators/auth-user.decorator';
import { IAuthUser } from './interfaces/user.interface';
import { GHAuthGuard } from 'src/github/github.guard';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days
  path: '/',
  signed: true,
} as const;

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly service: UserService) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    this.logger.log('githubAuth');
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log('githubCallback');
    this.logger.log(JSON.stringify(req.user));

    const user = req.user as IUserGitHub;

    if (!user) {
      return res.sendStatus(401);
    }

    if (!user.id) {
      return res.sendStatus(401);
    }

    const userDB =
      (await this.service.findUserByGitHubId(user.id)) ||
      (await this.service.createUserByGitHub(user));
    if (!userDB) {
      return res.sendStatus(500);
    }

    if (userDB?.role === UserRole.INACTIVE) {
      return res.sendStatus(403);
    }

    const tokens = await this.service.generateTokens({
      role: userDB.role,
      username: userDB.username,
      id: userDB.id,
      email: userDB.email,
      gitHubId: userDB.gitHubId ?? '',
    });
    const clearedUser = plainToInstance(UserOutDTO, userDB);
    const frontendUrl = await this.service.getFrontendURlPage();

    res.cookie('access_token', tokens.accessToken, cookieOptions);
    res.cookie('refresh_token', tokens.refreshToken, cookieOptions);

    return res.redirect(
      `${frontendUrl}?user=${encodeURIComponent(JSON.stringify(clearedUser))}`,
    );
  }

  @Get('logout')
  @UseGuards(GHAuthGuard)
  async logout(@Res() res: Response, @AuthUser() authUser: IAuthUser) {
    try {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      await this.service.logout(authUser.id, () => {
        return res.sendStatus(200);
      });
    } catch (error) {
      this.logger.error(error);
      return res.sendStatus(500);
    }
  }

  @Get('user')
  async user(@Req() req: Request) {
    const user = req.user as IUserGitHub;
    if (!user) {
      return null;
    }
    const userDB = await this.service.findUserByGitHubId(user.id);
    return plainToInstance(UserOutDTO, userDB);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.signedCookies['refresh_token'];
    const auth = await this.service.checkAndValidateToken(refreshToken);

    if (!auth) {
      throw new BadRequestException('Invalid refresh token');
    }

    const user = await this.service.findUserById(auth.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const tokens = await this.service.generateTokens({
      role: user.role,
      username: user.username,
      id: user.id,
      email: user.email,
      gitHubId: user.gitHubId ?? '',
    });
    res.cookie('access_token', tokens.accessToken, cookieOptions);
    res.cookie('refresh_token', tokens.refreshToken, cookieOptions);
    return res.sendStatus(200);
  }
}
