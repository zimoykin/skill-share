import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { IUserGitHub } from './interfaces/github-user.interface';
import { plainToInstance } from 'class-transformer';
import { UserOutDTO } from './dtos/user-out-dto';
import { UserRole } from './enums/user-role.enum';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    this.logger.log('githubAuth');
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
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
      (await this.authService.findUserByGitHubId(user.id)) ||
      (await this.authService.createUserByGitHub(user));
    if (!userDB) {
      return res.sendStatus(500);
    }

    if (userDB?.role === UserRole.INACTIVE) {
      return res.sendStatus(403);
    }
    const clearedUser = plainToInstance(UserOutDTO, userDB);

    const frontendUrl = await this.authService.getFrontendURlPage();
    res.redirect(
      `${frontendUrl}?user=${encodeURIComponent(JSON.stringify(clearedUser))}`,
    );
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.logout(() => {
      res.sendStatus(200);
    });
  }

  @Get('user')
  async user(@Req() req: Request) {
    const user = req.user as IUserGitHub;
    if (!user) {
      return null;
    }
    const userDB = await this.authService.findUserByGitHubId(user.id);
    return plainToInstance(UserOutDTO, userDB);
  }
}
