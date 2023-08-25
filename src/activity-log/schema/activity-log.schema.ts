import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ActivityLogDocument = HydratedDocument<ActivityLog>;

@Schema()
export class ActivityLog {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true, default: Date.now })
  timestamp: Date;

  @Prop() // Store additional data if needed
  data: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);
