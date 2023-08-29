import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Permission } from 'src/permission/schema/permission.schema';
import { University } from 'src/university/schema/university.schema';

export type StaffDocument = HydratedDocument<Staff>;

@Schema({ timestamps: true })
export class Staff {
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

  @Prop({ unique: true, required: true })
  idNo: string;

  @Prop()
  refreshToken: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'University' })
  university: University;

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'Permission', require: true }])
  permissions: Permission[];
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
