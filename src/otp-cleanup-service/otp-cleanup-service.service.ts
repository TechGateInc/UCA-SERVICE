import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class OtpCleanupService {
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
      console.error('Error cleaning up expired OTPs:', error);
    }
  }
}
