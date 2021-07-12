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
    const tokens = this.generateTokens(user);
    return { ...tokens, user: { ...user.toJSON() } };
  }

  async signUp(userData: ICreateUser) {
    return this.usersService.create(userData);
  }

  private generateTokens(user: UserDocument) {
    const accessToken = sign(
      { sub: user._id, email: user.email },
      this.configService.get('JWT_SECRET'),
      { expiresIn: this.configService.get('JWT_ACCESS_EXP') },
    );

    const refreshToken = sign(
      { sub: user._id, email: user.email },
      this.configService.get('JWT_REFRESH_SECRET'),
      { expiresIn: this.configService.get('JWT_REFRESH_EXP') },
    );

    return { accessToken, refreshToken };
  }
}
