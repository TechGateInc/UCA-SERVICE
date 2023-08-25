import { Injectable } from '@nestjs/common';
import { ActivityLog, ActivityLogDocument } from './schema/activity-log.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectModel(ActivityLog.name)
    private activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async createActivityLog(
    userId: any,
    action: string,
    data?: any,
  ): Promise<ActivityLog> {
    const activityLog = new this.activityLogModel({
      userId,
      action,
      data,
    });
    return activityLog.save();
  }

  async getLogsByUserId(userId: string): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .exec();
  }
  async getAllLogs(query: ExpressQuery): Promise<ActivityLog[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page);
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const activityLogs = await this.activityLogModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return activityLogs;
  }
}
