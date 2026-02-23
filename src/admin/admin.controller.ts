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
import { UsersService } from '../users/users.service';


@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
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

  const result = await this.adminService.confirmTeacher(
    verificationId,
    decision,
  );

  if (!result.success) {
    throw new BadRequestException(result.message);
  }

  // ✅ On récupère userId depuis le service
  const userId = result.data?.userId;

  if (!userId) {
    throw new BadRequestException('Utilisateur associé introuvable');
  }

  const message =
    decision === 'accepted'
      ? 'Votre profil enseignant a été validé'
      : 'Votre demande de certification a été refusée';

  // ✅ Notification envoyée
  try {
    await this.usersService.sendNotification(
      userId,
      'Certification',
      message,
    );
  } catch (error) {
    console.error('Erreur notification certification:', error);
  }

  return {
    success: true,
    message: result.message,
    data: result.data,
  };
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

