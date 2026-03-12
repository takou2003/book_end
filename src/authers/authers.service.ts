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
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

@Injectable()
export class AuthersService {

  // 📱 Propriétés pour Orange SMS
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly sender: string;
  private readonly tokenUrl: string;
  private readonly apiUrl: string;

  constructor(
    @InjectRepository(Auther)
    private readonly repo: Repository<Auther>,
    private readonly mailer: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.clientId = this.configService.get<string>('ORANGE_SMS_CLIENT_ID') ?? '';
    this.clientSecret = this.configService.get<string>('ORANGE_SMS_CLIENT_SECRET') ?? '';
    this.sender = this.configService.get<string>('ORANGE_SMS_SENDER') ?? '';
    this.tokenUrl = this.configService.get<string>('ORANGE_SMS_TOKEN_URL') ?? 'https://api.orange.com/oauth/v3/token';
    this.apiUrl = this.configService.get<string>('ORANGE_SMS_API_URL') ?? 'https://api.orange.com/smsmessaging/v1/outbound';

    if (!this.clientId || !this.clientSecret || !this.sender) {
      throw new Error('Variables d\'environnement Orange SMS manquantes');
    }
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private getExpiration(): Date {
    return new Date(Date.now() + 3 * 60 * 1000);
  }

  // ========== TES TEMPLATES EMAIL ORIGINAUX ==========
  private getEmailTemplate(email: string, code: string, isReset: boolean = false): string {
    const username = email.split('@')[0];
    const title = isReset ? 'Réinitialisation du mot de passe' : 'Vérification de votre compte';
    const subject = isReset ? 'Code de réinitialisation' : 'Code de vérification';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px;
            text-align: center;
          }
          .header img {
            max-width: 150px;
            height: auto;
            margin-bottom: 10px;
          }
          .header h1 {
            color: white;
            margin: 10px 0 0;
            font-size: 24px;
            font-weight: 300;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
          }
          .greeting strong {
            color: #667eea;
          }
          .message {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .code-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
          }
          .code-box p {
            color: white;
            font-size: 14px;
            margin: 0 0 10px;
            opacity: 0.9;
          }
          .code {
            font-size: 48px;
            font-weight: bold;
            color: white;
            letter-spacing: 5px;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }
          .expiration {
            color: #999;
            font-size: 14px;
            margin: 20px 0;
          }
          .support {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0 0;
          }
          .support p {
            color: #666;
            margin: 0 0 10px;
          }
          .support-link {
            color: #667eea;
            text-decoration: none;
            font-weight: bold;
            border-bottom: 2px solid #667eea;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          .footer p {
            color: #999;
            font-size: 12px;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://img.icons8.com/color/96/000000/book.png" alt="BookUp">
            <h1>${title}</h1>
          </div>
          
          <div class="content">
            <div class="greeting">
              Bonjour <strong>${username}</strong>,
            </div>
            
            <div class="message">
              ${isReset 
                ? 'Votre code de réinitialisation est :' 
                : 'Votre code d\'accès pour une connexion unique à la plateforme BookUp est :'}
            </div>
            
            <div class="code-box">
              <p>${subject}</p>
              <div class="code">${code}</div>
            </div>
            
            <div class="expiration">
              ⏱️ Ce code est valable 3 minutes
            </div>
            
            <div class="support">
              <p>Si vous pensez que ce courriel a été envoyé par erreur,</p>
              <p>veuillez contacter notre support :</p>
              <a href="mailto:contact@bookupstudy.com" class="support-link">contact@bookupstudy.com</a>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2025-2026 Bookup, Inc., Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // ========== TA MÉTHODE EMAIL ORIGINALE ==========
  async sendOrResendCode(email: string) {
    const alreadyVerified = await this.repo.findOne({
      where: { 
        identifiant: email,
        used: true,
      },
    });

    if (alreadyVerified) {
      throw new ConflictException('Cet identifiant a déjà été vérifié');
    }

    let auther = await this.repo.findOne({
      where: { 
        identifiant: email,
        used: false,
      },
    });

    if (auther && auther.expiresAt > new Date()) {
      try {
        await this.mailer.sendMail({
          to: email,
          subject: ' Code de vérification Bookup',
          html: this.getEmailTemplate(email, auther.code, false),
          text: `Bonjour,\n\nVotre code de vérification est : ${auther.code}\n\nCe code est valable 3 minutes.\n\nSi vous pensez que ce courriel a été envoyé par erreur, contactez-nous à contact@bookupstudy.com`,
        });

        return { message: 'Code renvoyé' };
      } catch (error) {
        console.error('Erreur envoi email:', error);
      }
    }

    const code = this.generateCode();
    const expiresAt = this.getExpiration();

    if (auther) {
      await this.repo.update(
        { id: auther.id },
        { 
          code: code,
          expiresAt: expiresAt,
          used: false 
        }
      );
    } else {
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
      subject: ' Code de vérification Bookup',
      html: this.getEmailTemplate(email, code, false),
      text: `Bonjour,\n\nVotre code de vérification est : ${code}\n\nCe code est valable 3 minutes.\n\nSi vous pensez que ce courriel a été envoyé par erreur, contactez-nous à contact@bookupstudy.com`,
    });

    return { message: 'Code envoyé' };
  }
  
  // ========== TA MÉTHODE RESET ORIGINALE ==========
  async resendResetCode(email: string) {
    const reset = await this.repo.findOne({
      where: { identifiant: email },
    });

    if (!reset) {
      return { message: 'Si un compte existe, un email a été envoyé' };
    }

    const newCode = this.generateCode();
    const newExpiration = this.getExpiration();

    await this.repo.update(
      { id: reset.id },
      {
        code: newCode,
        expiresAt: newExpiration,
        used: false
      },
    );

    await this.mailer.sendMail({
      to: email,
      subject: '🔄 Réinitialisation du mot de passe Bookup',
      html: this.getEmailTemplate(email, newCode, true),
      text: `Bonjour,\n\nVotre code de réinitialisation est : ${newCode}\n\nCe code est valable 3 minutes.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.`,
    });

    return { message: 'Si un compte existe, un email a été envoyé' };
  }

async verifyCode(identifiant: string, code: string) {
  
  const auther = await this.repo.findOne({
    where: { 
      identifiant: identifiant,
      used: false,
    },
  });

  if (!auther) {

    throw new BadRequestException('Code introuvable ou déjà utilisé');
  }

 
  const maintenant = new Date();
  /*console.log('🕐 Maintenant:');
  console.log('- Date brute:', maintenant);
  console.log('- ISO:', maintenant.toISOString());
  console.log('- Timestamp:', maintenant.getTime());
  console.log('- Timezone offset:', maintenant.getTimezoneOffset());
  
  const diffMs = auther.expiresAt.getTime() - maintenant.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  console.log(`📊 Différence: ${diffMs}ms (${diffSec} secondes)`);*/
  
  if (auther.expiresAt < maintenant) {
    /*console.log('❌ CODE EXPIRÉ');
    console.log(`   Expire: ${auther.expiresAt.toISOString()}`);
    console.log(`   Maintenant: ${maintenant.toISOString()}`);
    console.log(`   Plus petit? ${auther.expiresAt < maintenant}`);*/
    throw new BadRequestException('Code expiré');
  }

  if (auther.code !== code) {
    /*console.log('❌ CODE INCORRECT');
    console.log(`   Attendu: ${auther.code}`);
    console.log(`   Reçu: ${code}`);*/
    throw new BadRequestException('Code incorrect');
  }

  console.log('✅ CODE VALIDE - Mise à jour used=true');
  await this.repo.update(
    { id: auther.id },
    { used: true }
  );

  /*console.log('✅ Vérification réussie');
  console.log('='.repeat(50));*/
  
  return {
    message: 'Vérification réussie',
    identifiant,
  };
}

  async isAlreadyVerified(identifiant: string): Promise<boolean> {
    const verified = await this.repo.findOne({
      where: { 
        identifiant: identifiant,
        used: true,
      },
    });
    return !!verified;
  }

  // ========== MÉTHODES SMS AJOUTÉES (SANS RIEN CHANGER AU RESTE) ==========
  private async getOrangeAccessTokenWithCurl(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    try {
      console.log('🔄 Obtention token via curl...');
      
      const basicAuth = 'SGFLNVM3UTZQbGhzS2FwOGtxVTdYT2VqS250Y3BmRHU6aktDRUdxZjFYY0NUZk5WWnVNaTlqNzluMTl4YXRGRGxDT0RyMEE4c05HVWY=';
      
      const { stdout } = await execPromise(
        `curl -s -X POST "https://api.orange.com/oauth/v3/token" \
          -H "Authorization: Basic ${basicAuth}" \
          -H "Content-Type: application/x-www-form-urlencoded" \
          -H "Accept: application/json" \
          -d "grant_type=client_credentials"`
      );

      const response = JSON.parse(stdout);
      const newToken = response.access_token;
      
      this.accessToken = newToken;
      this.tokenExpiry = new Date(Date.now() + (response.expires_in * 1000));
      
      console.log('✅ Token obtenu via curl');
      return newToken;
      
    } catch (error) {
      console.error('❌ Erreur curl token:', error);
      throw new Error('Impossible d\'obtenir le token SMS');
    }
  }

  private async sendSmsWithCurl(phoneNumber: string, message: string): Promise<void> {
    try {
      const token = await this.getOrangeAccessTokenWithCurl();
      
      const formattedPhone = phoneNumber.startsWith('+') ? `tel:${phoneNumber}` : phoneNumber;
      const escapedMessage = message.replace(/"/g, '\\"');
      
      const curlCommand = `curl -s -X POST "${this.apiUrl}/${this.sender}/requests" \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json" \
        -d '{
          "outboundSMSMessageRequest": {
            "address": ["${formattedPhone}"],
            "senderAddress": "${this.sender}",
            "outboundSMSTextMessage": {
              "message": "${escapedMessage}"
            }
          }
        }'`;

      const { stdout } = await execPromise(curlCommand);
      console.log('✅ SMS envoyé via curl');
      
    } catch (error) {
      console.error('❌ Erreur curl SMS:', error);
      throw new Error('Échec de l\'envoi du SMS');
    }
  }

  async sendOrResendCodeSms(phone: string) {
    const alreadyVerified = await this.repo.findOne({
      where: { 
        identifiant: phone,
        used: true,
      },
    });

    if (alreadyVerified) {
      throw new ConflictException('Ce numéro a déjà été vérifié');
    }

    let auther = await this.repo.findOne({
      where: { 
        identifiant: phone,
        used: false,
      },
    });

    if (auther && auther.expiresAt > new Date()) {
      try {
        const message = `Bookup: Votre code de vérification est ${auther.code}. Valable 3 minutes.`;
        await this.sendSmsWithCurl(phone, message);
        return { message: 'Code renvoyé par SMS' };
      } catch (error) {
        console.error('Erreur envoi SMS:', error);
      }
    }

    const code = this.generateCode();
    const expiresAt = this.getExpiration();

    if (auther) {
      await this.repo.update(
        { id: auther.id },
        { 
          code: code,
          expiresAt: expiresAt,
          used: false 
        }
      );
    } else {
      auther = this.repo.create({
        identifiant: phone,
        code,
        expiresAt,
        used: false,
      });
      await this.repo.save(auther);
    }

    const message = `Bookup: Votre code de vérification est ${code}. Valable 3 minutes.`;
    await this.sendSmsWithCurl(phone, message);

    return { message: 'Code envoyé par SMS' };
  }

  async resendResetCodeSms(phone: string) {
  // 1️⃣ Vérifier si un enregistrement existe
  const reset = await this.repo.findOne({
    where: { identifiant: phone },
  });

  // 🔒 Toujours réponse neutre (sécurité)
  if (!reset) {
    return { message: 'Si un compte existe, un SMS a été envoyé' };
  }

  // 2️⃣ Générer nouveau code
  const newCode = this.generateCode();
  const newExpiration = this.getExpiration();

  // 3️⃣ Mise à jour en base
  await this.repo.update(
    { id: reset.id },
    {
      code: newCode,
      expiresAt: newExpiration,
      used: false
    },
  );

  // 4️⃣ Envoi du SMS
  const message = `Bookup: Votre code de réinitialisation est ${newCode}. Valable 3 minutes.`;
  await this.sendSmsWithCurl(phone, message);

  // 5️⃣ Réponse neutre
  return { message: 'Si un compte existe, un SMS a été envoyé' };
}
}
