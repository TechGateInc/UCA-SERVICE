import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FacultyDocument = HydratedDocument<Faculty>;

@Schema({
  timestamps: true,
})
export class Faculty {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  school: string;

  @Prop({ required: true })
  creator: string;
}

export const FacultySchema = SchemaFactory.createForClass(Faculty);
