import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailClient, SendMailResponse } from 'zeptomail';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
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
      this.logger.log(
        `Email sent successfully. Response: ${JSON.stringify(response)}`,
      );
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`);
      throw error;
    }
  }
}
