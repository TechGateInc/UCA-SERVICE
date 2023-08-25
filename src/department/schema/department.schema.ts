import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DepartmentDocument = HydratedDocument<Department>;

@Schema({
  timestamps: true,
})
export class Department {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  school: string;

  @Prop({ required: true, unique: true })
  creator: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
