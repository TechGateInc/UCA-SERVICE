import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LecturerDocument = HydratedDocument<Lecturer>;

@Schema({
  timestamps: true,
})
export class Lecturer {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  otherName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  resetOTP: string;

  @Prop()
  phoneNo: string;

  @Prop()
  idNo: string;

  @Prop()
  refreshToken: string;
}

export const LecturerSchema = SchemaFactory.createForClass(Lecturer);
