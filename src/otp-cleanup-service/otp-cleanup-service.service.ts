import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { StudentService } from 'src/student/student.service';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class OtpCleanupService {
  private readonly logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.Console(), // Console transport for logging to console
      new transports.File({ filename: 'otp-cleanup-service.log' }), // File transport for saving logs to a file
    ],
  });

  constructor(private readonly studentService: StudentService) {
    // Schedule a cron job to clean up expired OTPs every minute
    cron.schedule('* * * * *', () => {
      this.cleanupExpiredOTPs();
    });
  }

  async cleanupExpiredOTPs() {
    try {
      await this.studentService.deleteExpiredOTPs();
    } catch (error) {
      this.logger.error({
        level: 'error',
        message: 'Error cleaning up expired OTPs',
        error: error.message,
      });
    }
  }
}
