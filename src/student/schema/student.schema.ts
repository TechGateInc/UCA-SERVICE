import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { UserDevice } from 'src/userdevice/schema/userdevice.schema';

export type StudentDocument = HydratedDocument<Student>;

@Schema({
  timestamps: true,
})
export class Student {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  resetOTP: string;

  @Prop()
  resetOTPExpiration: Date;

  @Prop()
  idNo: string;

  @Prop()
  refreshToken: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'UserDevice' })
  device: UserDevice;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
