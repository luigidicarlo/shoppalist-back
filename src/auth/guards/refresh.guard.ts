import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { IAuthReq } from '../interface/auth-req.interface';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as IAuthReq;

    const refreshToken = request.header('Authorization');

    if (!refreshToken) throw new UnauthorizedException('refresh.invalid-token');

    const payload = verify(
      refreshToken,
      this.configService.get('JWT_REFRESH_SECRET'),
    );

    const user = await this.usersService.getById(payload.sub as string);

    if (!user) throw new UnauthorizedException('refresh.invalid-token');

    request.user = user;

    return true;
  }
}
