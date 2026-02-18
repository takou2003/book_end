//auth.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  HttpCode,
  BadRequestException,
  Delete,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(
      dto.mail,
      dto.password,
    );
    return this.authService.login(user);
  }

@Post('refresh')
@HttpCode(200)
refresh(@Body('refreshToken') token: string) {
  if (!token) {
    throw new BadRequestException('Refresh token requis');
  }

  return this.authService.refresh(token);
}


  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req) {
    return this.authService.logout(req.user.userId);
  }
    
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req) {
   return this.authService.getMe(req.user);
  }
}

