import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConfigVariables } from '../service-config';

@Injectable()
export class JWTGuard implements CanActivate {
  private readonly logger = new Logger(JWTGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<ConfigVariables>,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const token = req.signedCookies['access_token'];
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      req.user = payload;
      return token != null;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
