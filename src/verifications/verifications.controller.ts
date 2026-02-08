import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import type { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import * as path from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('verifications')
export class VerificationsController {
  private readonly documentsDir = join(__dirname, '..', '..', 'Documents');

  constructor(
    private readonly verificationsService: VerificationsService,
  ) {}

  /* =====================================================
   * ADMIN – toutes les vérifications
   * ===================================================== */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllVerifications() {
    return this.verificationsService.getAllVerifications();
  }

  /* =====================================================
   * VERIFICATIONS PAR TUTEUR
   * ===================================================== */
  @UseGuards(JwtAuthGuard)
  @Get('teacher/:teacherId')
  async getTeacherVerifications(
    @Param('teacherId', ParseIntPipe) teacherId: number,
  ) {
    return this.verificationsService.getVerificationsByTeacher(teacherId);
  }

  /* =====================================================
   * UNE VÉRIFICATION
   * ===================================================== */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getVerification(@Param('id', ParseIntPipe) id: number) {
    const verification =
      await this.verificationsService.getVerificationById(id);

    return {
      ...verification,
      downloadUrl: `/verifications/download/${verification.pathDocument}`,
      viewUrl: `/verifications/view/${verification.pathDocument}`,
    };
  }

  /* =====================================================
   * DOWNLOAD
   * ===================================================== */
  @Get('download/:filename')
  async download(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath =
      await this.verificationsService.getFilePath(filename);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`,
    );

    return res.sendFile(filePath);
  }

  /* =====================================================
   * VIEW INLINE
   * ===================================================== */
  @Get('view/:filename')
  async view(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath =
      await this.verificationsService.getFilePath(filename);

    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.txt': 'text/plain',
    };

    res.setHeader(
      'Content-Type',
      mimeTypes[ext] || 'application/octet-stream',
    );
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${filename}"`,
    );

    return res.sendFile(filePath);
  }
}

