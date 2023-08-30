import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({
  timestamps: true,
})
export class Course {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true, unique: true })
  courseabrev: string;

  @Prop({ required: true, unique: true })
  department: string;

  @Prop({ required: true, unique: true })
  unit: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
