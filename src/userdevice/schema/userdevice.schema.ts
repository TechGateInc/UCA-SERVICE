import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Student } from 'src/student/schema/student.schema';

export type UserDeviceDocument = HydratedDocument<UserDevice>;

@Schema({
  timestamps: true,
})
export class UserDevice {
  @Prop({ required: true })
  deviceName: string;

  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.ObjectId,
    ref: 'Student',
  })
  user: Student;

  @Prop({ required: true, unique: true })
  deviceId: string;

  @Prop({ required: true })
  lastLogin: Date;
}

export const UserDeviceSchema = SchemaFactory.createForClass(UserDevice);
