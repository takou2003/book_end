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
          subject: ' Code de vérification Bookup',
          html: `
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
                  <h1>Vérification de votre compte</h1>
                </div>
                
                <div class="content">
                  <div class="greeting">
                    Bonjour <strong>${email.split('@')[0]}</strong>,
                  </div>
                  
                  <div class="message">
                    Votre code d'accès pour une connexion unique à la plateforme BookUp est :
                  </div>
                  
                  <div class="code-box">
                    <p>Code de vérification</p>
                    <div class="code">${auther.code}</div>
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
          `,
          text: `Bonjour,\n\nVotre code de vérification est : ${auther.code}\n\nCe code est valable 3 minutes.\n\nSi vous pensez que ce courriel a été envoyé par erreur, contactez-nous à contact@bookupstudy.com`,
        });

        return { message: 'Code renvoyé' };
      } catch (error) {
        console.error('Erreur envoi email:', error);
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

    // 📧 Envoi de l'email avec le nouveau code
    await this.mailer.sendMail({
      to: email,
      subject: ' Code de vérification Bookup',
      html: `
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
              <h1>Vérification de votre compte</h1>
            </div>
            
            <div class="content">
              <div class="greeting">
                Bonjour <strong>${email.split('@')[0]}</strong>,
              </div>
              
              <div class="message">
                Votre code d'accès pour une connexion unique à la plateforme Bookup est :
              </div>
              
              <div class="code-box">
                <p>Code de vérification</p>
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
              <p>© 2024-2026 BookUp, Inc., Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Bonjour,\n\nVotre code de vérification est : ${code}\n\nCe code est valable 3 minutes.\n\nSi vous pensez que ce courriel a été envoyé par erreur, contactez-nous à contact@bookupstudy.com`,
    });

    return { message: 'Code envoyé' };
  }
  
  // 📩 RESET PASSWORD
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
      subject: '🔄 Réinitialisation du mot de passe Bookup',
      html: `
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
              margin: 0;
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
<img src="https://img.icons8.com/color/96/000000/book.png" alt="Bookup">
              <h1>Réinitialisation du mot de passe</h1>
            </div>
            
            <div class="content">
              <div class="greeting">
                Bonjour <strong>${email.split('@')[0]}</strong>,
              </div>
              
              <div class="message">
                Votre code de réinitialisation est :
              </div>
              
              <div class="code-box">
                <p>Code de réinitialisation</p>
                <div class="code">${newCode}</div>
              </div>
              
              <div class="expiration">
                ⏱️ Ce code est valable 3 minutes
              </div>
              
              <div class="support">
                <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
              </div>
            </div>
            
            <div class="footer">
              <p>© 2025-2026 Bookup, Inc., Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Bonjour,\n\nVotre code de réinitialisation est : ${newCode}\n\nCe code est valable 3 minutes.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.`,
    });

    return { message: 'Si un compte existe, un email a été envoyé' };
  }

  // ✅ VÉRIFICATION DU CODE
  async verifyCode(email: string, code: string) {
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

    const updateResult = await this.repo.update(
      { id: auther.id },
      { used: true }
    );

    if (updateResult.affected === 0) {
      throw new BadRequestException('Échec de la mise à jour du statut');
    }

    return {
      message: 'Vérification réussie',
      email,
    };
  }

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
