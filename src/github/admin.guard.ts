import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminAccess implements CanActivate {
  private readonly logger = new Logger(AdminAccess.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.user) {
      this.logger.error('User not found');
      return false;
    }
    if (req.user.role !== 'admin') {
      this.logger.error('User is not admin');
      return false;
    }
    return true;
  }
}
