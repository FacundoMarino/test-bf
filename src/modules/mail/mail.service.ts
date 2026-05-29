import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { EmailSendStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';

export type SendMailArgs = {
  to: string;
  subject: string;
  text: string;
  html: string;
  eventType: string;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Envía correo vía SMTP (Gmail u otro) y persiste auditoría en `email_send_logs`.
   * Fallos de envío no relanzan: se registran como FAILED para no bloquear la API.
   */
  async sendTransactional(params: SendMailArgs): Promise<void> {
    const fromRaw =
      this.config.get<string>('MAIL_FROM')?.trim() ??
      this.config.get<string>('SMTP_USER')?.trim() ??
      '';
    const enabled =
      this.config.get<string>('MAIL_ENABLED') !== 'false' &&
      this.config.get<string>('DISABLE_MAIL') !== 'true';

    if (!fromRaw || !enabled) {
      await this.prisma.emailSendLog.create({
        data: {
          status: EmailSendStatus.SKIPPED,
          eventType: params.eventType,
          fromEmail: fromRaw || '(sin MAIL_FROM)',
          toEmail: params.to,
          subject: params.subject,
          bodyText: params.text,
          bodyHtml: params.html,
          errorDetail: !enabled
            ? 'MAIL deshabilitado (MAIL_ENABLED=false o DISABLE_MAIL=true)'
            : 'Falta MAIL_FROM / SMTP_USER',
        },
      });
      return;
    }

    const host = this.config.get<string>('SMTP_HOST') ?? 'smtp.gmail.com';
    const port = Number(this.config.get<string>('SMTP_PORT') ?? '465');
    const secure =
      this.config.get<string>('SMTP_SECURE') !== 'false' && port === 465;
    const user = this.config.get<string>('SMTP_USER')?.trim();
    const pass = this.config.get<string>('SMTP_PASS') ?? '';

    if (!user || !pass) {
      await this.prisma.emailSendLog.create({
        data: {
          status: EmailSendStatus.SKIPPED,
          eventType: params.eventType,
          fromEmail: fromRaw,
          toEmail: params.to,
          subject: params.subject,
          bodyText: params.text,
          bodyHtml: params.html,
          errorDetail: 'Faltan SMTP_USER / SMTP_PASS',
        },
      });
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: fromRaw,
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html,
      });

      await this.prisma.emailSendLog.create({
        data: {
          status: EmailSendStatus.SENT,
          eventType: params.eventType,
          fromEmail: fromRaw,
          toEmail: params.to,
          subject: params.subject,
          bodyText: params.text,
          bodyHtml: params.html,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Mail send failed (${params.eventType}): ${message}`);
      await this.prisma.emailSendLog.create({
        data: {
          status: EmailSendStatus.FAILED,
          eventType: params.eventType,
          fromEmail: fromRaw,
          toEmail: params.to,
          subject: params.subject,
          bodyText: params.text,
          bodyHtml: params.html,
          errorDetail: message.slice(0, 4000),
        },
      });
    }
  }
}
