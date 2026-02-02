import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AppService {
  constructor(private readonly mailService: MailerService) {}

  async sendMail() {
    const message =
      `409173 is your verification code. For your security, do not share this code`;

    return await this.mailService.sendMail({
      to: 'bookup237@gmail.com',
      subject: 'confirmation code',
      text: message,
    });
  }
}
