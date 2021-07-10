import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, verify } from 'jsonwebtoken';
import { UsersService } from '../../users/users.service';
import { IAuthReq } from '../interface/auth-req.interface';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as IAuthReq;
    const secret = this.configService.get('JWT_SECRET');

    if (!req.headers.authorization)
      throw new UnauthorizedException('jwt.no-token-provided');

    const bearerToken = req.headers.authorization.split(' ')[1];

    if (!bearerToken) throw new UnauthorizedException('jwt.invalid-token');

    let payload: string | JwtPayload;

    try {
      payload = verify(bearerToken, secret);
    } catch {
      throw new UnauthorizedException('jwt.invalid-token');
    }

    if (!payload) throw new UnauthorizedException('jwt.invalid-token');

    const user = await this.usersService.getById(payload.sub as string);

    if (!user) throw new UnauthorizedException('jwt.invalid-token');

    req.user = user;

    return true;
  }
}
