import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ICreateUser } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { BasicAuthGuard } from './guards/basic.guard';
import { IAuthReq } from './interface/auth-req.interface';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(BasicAuthGuard)
  @Post('/login')
  async login(@Req() req: IAuthReq) {
    return this.authService.login(req.user);
  }

  @Post('/signup')
  async signUp(@Req() req: Request) {
    return this.authService.signUp(req.body as ICreateUser);
  }
}
