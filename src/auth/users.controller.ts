import {
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { UserOutDTO } from './dtos/user-out-dto';
import { GHAuthGuard } from 'src/github/github.guard';
import { AuthUser } from './decorators/auth-user.decorator';
import { IAuthUser } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly service: UserService) {}

  @Get()
  @UseGuards(GHAuthGuard)
  async findAll(@Req() req: Request, @AuthUser() user: IAuthUser) {
    this.logger.debug('findAll');
    if (!req.user) {
      throw new ForbiddenException();
    }

    if (!user.role && user.role !== 'ADMIN') {
      throw new ForbiddenException();
    }

    return this.service.findAll().then((users) => {
      return users.map((user) => plainToInstance(UserOutDTO, user));
    });
  }
}
