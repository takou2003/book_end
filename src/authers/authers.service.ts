// src/authers/authers.service.ts
import {
  Injectable,
  BadRequestException,
  ConflictException,
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
    // Vérifier si l'identifiant a déjà été vérifié
    const alreadyVerified = await this.repo.findOne({
      where: { 
        identifiant: email,
        used: true,
      },
    });

    if (alreadyVerified) {
      throw new ConflictException('Cet identifiant a déjà été vérifié');
    }

    // Chercher un enregistrement existant non utilisé
    let auther = await this.repo.findOne({
      where: { 
        identifiant: email,
        used: false,
      },
    });

    // 🔁 code encore valide → renvoi simple
    if (auther && auther.expiresAt > new Date()) {
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
      // UPDATE du code existant
      await this.repo.update(
        { id: auther.id },
        { 
          code: code,
          expiresAt: expiresAt,
          used: false 
        }
      );
    } else {
      // Création avec save (pour un nouvel enregistrement)
      auther = this.repo.create({
        identifiant: email,
        code,
        expiresAt,
        used: false,
      });
      await this.repo.save(auther);
    }

    await this.mailer.sendMail({
      to: email,
      subject: 'Code de vérification',
      text: `Votre code est : ${code} (valide 3 min)`,
    });

    return { message: 'Code envoyé' };
  }
  
  // 📩 RESET PASSWORD - UPDATE ONLY
async resendResetCode(email: string) {

  // 1️⃣ Vérifier si un enregistrement existe
  const reset = await this.repo.findOne({
    where: { identifiant: email },
  });

  // 🔒 Toujours réponse neutre
  if (!reset) {
    return { message: 'Si un compte existe, un email a été envoyé' };
  }

  // 2️⃣ Générer nouveau code
  const newCode = this.generateCode();
  const newExpiration = this.getExpiration();

  // 3️⃣ Update uniquement
  await this.repo.update(
    { id: reset.id },
    {
      code: newCode,
      expiresAt: newExpiration
    },
  );

  // 4️⃣ Envoi email
  await this.mailer.sendMail({
    to: email,
    subject: 'Réinitialisation du mot de passe',
    text: `Votre code est : ${newCode} (valide 3 min)`,
  });

  return { message: 'Si un compte existe, un email a été envoyé' };
}

  // ✅ VÉRIFICATION DU CODE (avec UPDATE)
  async verifyCode(email: string, code: string) {
    // Chercher l'enregistrement non utilisé
    const auther = await this.repo.findOne({
      where: { 
        identifiant: email,
        used: false,
      },
    });

    if (!auther) {
      throw new BadRequestException('Code introuvable ou déjà utilisé');
    }

    if (auther.expiresAt < new Date()) {
      throw new BadRequestException('Code expiré');
    }

    if (auther.code !== code) {
      throw new BadRequestException('Code incorrect');
    }

    // 🔒 UPDATE pour marquer comme utilisé
    const updateResult = await this.repo.update(
      { 
        id: auther.id
      },
      { 
        used: true 
      }
    );

    // Vérifier si l'update a réussi
    if (updateResult.affected === 0) {
      throw new BadRequestException('Échec de la mise à jour du statut');
    }

    return {
      message: 'Vérification réussie',
      email,
    };
  }

  // OPTIONNEL: Méthode utilitaire
  async isAlreadyVerified(email: string): Promise<boolean> {
    const verified = await this.repo.findOne({
      where: { 
        identifiant: email,
        used: true,
      },
    });
    return !!verified;
  }
}
