import {
  Controller,
  Post,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  Get,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { SignalService } from '../signal/signal.service';


@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    ) {}

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
  
  @Get('signal/summary')
  async getSummary() {
  return {
    success: true,
    data: await this.adminService.getReportedUsersSummary(),
  };
 }
 
 @Get('signals/:userId')
 async getDetails(@Param('userId', ParseIntPipe) userId: number) {
  return {
    success: true,
    data: await this.adminService.getSignalDetailsByUser(userId),
  };
}

@Patch('users/:id/toggle-status')
async toggleUserStatus(
  @Param('id', ParseIntPipe) id: number,
) {
  return {
    success: true,
    data: await this.adminService.toggleUserStatus(id),
  };
}

@Get('dashboard/count')
async getCounts() {
  const data = await this.adminService.countActiveUsersAndTutors();

  return {
    success: true,
    ...data,
  };
}


}

