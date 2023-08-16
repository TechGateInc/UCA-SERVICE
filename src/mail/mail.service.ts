import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mailgun from 'mailgun-js';

@Injectable()
export class MailerService {
  private mg: mailgun.Mailgun;
  constructor(private configService: ConfigService) {
    this.mg = mailgun({
      apiKey: this.configService.get<string>('MAILGUN_API_KEY'),
      domain: this.configService.get<string>('MAILGUN_DOMAIN'),
    });
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    const data = {
      from: 'Excited User <brad@sandboxc91bded581344980adfed87ebdbdb683.mailgun.org>',
      to,
      subject,
      text: content,
    };

    await this.mg.messages().send(data);
  }
}
