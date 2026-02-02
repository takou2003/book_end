// src/authers/authers.service.ts
import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auther } from './entities/auther.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthersService {
  constructor(
    @InjectRepository(Auther)
    private readonly repo: Repository<Auther>,
    private readonly mailer: MailerService,
  ) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private getExpiration(): Date {
    return new Date(Date.now() + 3 * 60 * 1000);
  }

  // 📩 ENVOI / RENVOI
  async sendOrResendCode(email: string) {
    let auther = await this.repo.findOne({
      where: { identifiant: email },
    });

    // 🔁 code encore valide → renvoi simple
    if (
      auther &&
      !auther.used &&
      auther.expiresAt > new Date()
    ) {
      try {
        await this.mailer.sendMail({
          to: email,
          subject: 'Code de vérification',
          text: `Votre code est : ${auther.code} (valide 3 min)`,
        });

        return { message: 'Code renvoyé' };
      } catch {
        // si l'envoi échoue → on régénère
      }
    }

    // 🆕 génération
    const code = this.generateCode();
    const expiresAt = this.getExpiration();

    if (auther) {
      auther.code = code;
      auther.expiresAt = expiresAt;
      auther.used = false;
    } else {
      auther = this.repo.create({
        identifiant: email,
        code,
        expiresAt,
        used: false,
      });
    }

    await this.repo.save(auther);

    await this.mailer.sendMail({
      to: email,
      subject: 'Code de vérification',
      text: `Votre code est : ${code} (valide 3 min)`,
    });

    return { message: 'Code envoyé' };
  }

  // ✅ VÉRIFICATION
  async verifyCode(email: string, code: string) {
    const auther = await this.repo.findOne({
      where: { identifiant: email },
    });

    if (!auther) {
      throw new BadRequestException('Code introuvable');
    }

    if (auther.used) {
      throw new BadRequestException('Code déjà utilisé');
    }

    if (auther.expiresAt < new Date()) {
      throw new BadRequestException('Code expiré');
    }

    if (auther.code !== code) {
      throw new BadRequestException('Code incorrect');
    }

    // 🔒 INVALIDATION IMMÉDIATE
    auther.used = true;
    await this.repo.save(auther);

    return {
      message: 'Vérification réussie',
      email,
    };
  }
}

