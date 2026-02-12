// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

async validateUser(mail: string, password: string): Promise<User> {
  const user = await this.usersService.findByEmail(mail);

  // ❌ User not found
  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  // ❌ Wrong password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid email or password');
  }

  // 🚫 Account blocked
  if (!user.isActive) {
    throw new UnauthorizedException(
      'Your account has been blocked. Please contact the administrator.',
    );
  }

  return user;
}


  async login(user: User) {
    const payload = {
      sub: user.id,
      mail: user.mail,
      role: user.fonction,
      ville: user.ville,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '30m',
      secret: process.env.JWT_SECRET!,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '90d',
      secret: process.env.JWT_REFRESH_SECRET!,
    });

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, expiresIn: 1800,};
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET!,
    });

    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException();
    }

    return this.login(user);
  }

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
    return { message: 'Logged out' };
  }
  
async getMe(userFromToken: { id: number; fonction: string }) {
  const user = await this.usersService.findMeWithRelations(userFromToken.id);

  if (!user) {
    throw new UnauthorizedException();
  }
  const image = user.pathImage;
  const response: any = {
    id: user.id,
    username: user.username,
    mail: user.mail,
    phone: user.phone,
    fonction: user.fonction,
    ville: user.ville,
    quartier: user.quartier,
    role: user.role,
    pathImage: user.pathImage,
    imageUrl: `http://localhost:3000/profils/${image}`,
  };

  // 🎓 TUTOR
  if (user.fonction === 'tutor') {
    response.tutor = {
      id: user.tutor?.id,
      mark: user.tutor?.mark,
      isActive: user.tutor?.isActive,
    };
  }

  // 👑 ADMIN
  if (user.fonction === 'admin') {
    response.permissions = ['ALL'];
  }

  return response;
}

}

