// src/authers/authers.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthersService } from './authers.service';

@Controller('auth')
export class AuthersController {
  constructor(private readonly service: AuthersService) {}

  @Post('send-code')
  send(@Body('email') email: string) {
    return this.service.sendOrResendCode(email);
  }
  
  @Post('send-reset-code')
  reset(@Body('email') email: string) {
    return this.service.resendResetCode(email);
  }

  @Post('verify-code')
  verify(
    @Body('email') email: string,
    @Body('code') code: string,
  ) {
    return this.service.verifyCode(email, code);
  }
}

