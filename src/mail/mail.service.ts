import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailClient, SendMailResponse } from 'zeptomail';
import { createLogger, format, transports } from 'winston';
import moment, { utc } from 'moment-timezone';

@Injectable()
export class MailerService {
  private readonly logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'logs/mailer-service.log' }),
    ],
  });

  private client: SendMailClient;

  constructor(private configService: ConfigService) {
    this.client = new SendMailClient({
      url: this.configService.get<string>('ZEPTOMAIL_HOST'),
      token: this.configService.get<string>('ZEPTOMAIL_TOKEN'),
    });
  }

  async sendWelcomeEmail(to: string, name?: string): Promise<void> {
    await this.sendMailWithTemplate(
      to,
      this.configService.get('WELCOME_TEMPLATE_KEY'),
      name,
    );
  }

  async sendForgotPasswordEmail(
    to: string,
    otp: string,
    name: string,
  ): Promise<void> {
    await this.sendMailWithTemplate(
      to,
      this.configService.get('PASSWORD_RESET_TEMPLATE_KEY'),
      otp,
      name,
    );
  }

  async sendLoginEmail(
    to: string,
    name: string,
    deviceName: string,
    date: Date,
    otp?: null,
  ): Promise<void> {
    function formatDateTime(inputDate) {
      const date = new Date(inputDate);

      // Format the time as "hh:mm AM/PM"
      const timeString = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Format the date as "Month Day, Year"
      const dateString = date.toLocaleDateString([], {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Combine the formatted date and time
      return `${timeString} on ${dateString}`;
    }

    const loginDate = formatDateTime(date);

    await this.sendMailWithTemplate(
      to,
      this.configService.get('LOGIN_TEMPLATE_KEY'),
      otp,
      name,
      deviceName,
      loginDate,
    );
  }

  async sendJoinWaitlistEmail(to: string): Promise<void> {
    await this.sendMailWithTemplate(
      to,
      this.configService.get('WAITLIST_TEMPLATE_KEY'),
    );
  }

  private async sendMailWithTemplate(
    to: string,
    template_key: string,
    // template_alias: string,
    otp?: string,
    name?: string | 'Recipient',
    deviceName?: string,
    date?: string,
  ): Promise<void> {
    const emailParams = {
      template_key: template_key,
      // template_alias: template_alias,
      from: {
        address: 'noreply@techgate.tech',
        name: 'UCA Team',
      },
      to: [
        {
          email_address: {
            address: to,
            name: name,
          },
        },
      ],
      merge_info: {
        OTP: otp,
        name: name,
        deviceName: deviceName,
        date: date,
      },
      reply_to: [
        {
          address: 'help@techgate.tech',
          name: 'Recipient',
        },
      ],
    };
    try {
      const response: SendMailResponse = await this.client.sendMailWithTemplate(
        emailParams,
      );
      this.logger.log({
        level: 'info',
        message: `Email sent successfully. Response: ${JSON.stringify(
          response,
        )}`,
      });
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: `Error sending email: ${error.message}`,
      });
      return Promise.reject(new Error('An unexpected error occurred')); // Re-return Promise.reject( the error to let the global error handler handle i)t
    }
  }
}
