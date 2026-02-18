import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { User } from '../users/entities/user.entity';
import { Notification } from './entities/notifications.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User]),
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
