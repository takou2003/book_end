import {
  Controller,
  Post,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('confirm-teacher/:verificationId')
  async confirmTeacher(
    @Param('verificationId') verificationId: number,
    @Query('decision') decision: 'accepted' | 'denied',
  ) {
    if (!decision) {
      throw new BadRequestException('decision requis');
    }

    if (!['accepted', 'denied'].includes(decision)) {
      throw new BadRequestException(
        "decision doit être 'accepted' ou 'denied'",
      );
    }

    return this.adminService.confirmTeacher(
      verificationId,
      decision,
    );
  }
  @Get('all-verification')
  async getAllVerifications() {
    return this.adminService.getAllVerifications();
  }
}

