import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
  phoneNo: string;

  @Prop()
  idNo: string;

  @Prop()
  refreshToken: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
