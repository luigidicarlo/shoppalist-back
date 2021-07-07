import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { ICreateUser } from '../users/dto/create-user.dto';
import { UserDocument } from '../users/users.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async login(user: UserDocument) {
    const token = sign(
      { sub: user._id, email: user.email },
      this.configService.get('JWT_SECRET'),
      { expiresIn: '1d' },
    );

    return { token, user: { ...user.toJSON() } };
  }

  async signUp(userData: ICreateUser) {
    return this.usersService.create(userData);
  }
}
