import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailClient, SendMailResponse } from 'zeptomail';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class MailerService {
  private readonly logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.Console(), // Console transport for logging to console
      new transports.File({ filename: 'mailer-service.log' }), // File transport for saving logs to a file
    ],
  });

  private client: SendMailClient;

  constructor(private configService: ConfigService) {
    this.client = new SendMailClient({
      url: this.configService.get<string>('ZEPTOMAIL_HOST'),
      token: this.configService.get<string>('ZEPTOMAIL_TOKEN'),
    });
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    const emailParams = {
      from: {
        address: 'noreply@techgate.tech',
        name: 'UCA Team',
      },
      to: [
        {
          email_address: {
            address: to,
            name: 'Recipient',
          },
        },
      ],
      subject,
      htmlbody: content,
    };

    try {
      const response: SendMailResponse = await this.client.sendMail(
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
      throw error;
    }
  }
}
