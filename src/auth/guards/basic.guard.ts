import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { UsersService } from '../../users/users.service';
import { IAuthReq } from '../interface/auth-req.interface';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as IAuthReq;

    const email = req.body.email;
    const password = req.body.password;

    if (!email) throw new BadRequestException('basic-auth.no-email-sent');

    if (!password) throw new BadRequestException('basic-auth.no-password-sent');

    const user = await this.usersService.getByEmail(email);

    if (!user) throw new BadRequestException('basic-auth.invalid-credentials');

    if (!compareSync(password, user.password))
      throw new BadRequestException('basic-auth.invalid-credentials');

    req.user = user;

    return true;
  }
}
