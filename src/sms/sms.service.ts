import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class SmsService {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private async getAccessToken(): Promise<string> {
    // Vérifier si le token est encore valide
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    try {
      const clientId = this.configService.get<string>('ORANGE_SMS_CLIENT_ID');
      const clientSecret = this.configService.get<string>('ORANGE_SMS_CLIENT_SECRET');
      const tokenUrl = this.configService.get<string>('ORANGE_SMS_TOKEN_URL');

      if (!clientId || !clientSecret || !tokenUrl) {
        throw new Error('Configuration SMS Orange manquante');
      }

      // Créer l'en-tête Authorization Basic
      const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      
      const response = await lastValueFrom(
        this.httpService.post(tokenUrl, 
          'grant_type=client_credentials',
          {
            headers: {
              'Authorization': `Basic ${credentials}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            },
          }
        )
      );

      // Typer la réponse
      const data = response.data as { access_token: string; expires_in: number };
      
      this.accessToken = data.access_token;
      // Définir l'expiration (généralement 3600 secondes)
      this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
      
      return this.accessToken;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Erreur obtention token Orange:', axiosError.response?.data || axiosError.message);
      throw new HttpException(
        'Impossible d\'obtenir le token SMS',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendSms(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      const sender = this.configService.get<string>('ORANGE_SMS_SENDER');
      const apiUrl = this.configService.get<string>('ORANGE_SMS_API_URL');

      if (!sender || !apiUrl) {
        throw new Error('Configuration SMS Orange manquante');
      }

      // Formater le numéro de téléphone (ajouter tel: si nécessaire)
      const formattedPhone = phoneNumber.startsWith('tel:') 
        ? phoneNumber 
        : `tel:${phoneNumber}`;

      const response = await lastValueFrom(
        this.httpService.post(
          `${apiUrl}/${sender}/requests`,
          {
            outboundSMSMessageRequest: {
              address: [formattedPhone],
              senderAddress: sender,
              outboundSMSTextMessage: {
                message: message,
              },
            },
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      console.log('SMS envoyé avec succès:', response.data);
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Erreur envoi SMS:', axiosError.response?.data || axiosError.message);
      return false;
    }
  }

  // Pour réinitialiser le token en cas de besoin
  resetToken(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
  }
}
