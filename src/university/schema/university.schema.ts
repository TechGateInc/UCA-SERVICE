import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UniveristyDocument = HydratedDocument<University>;

@Schema({
  timestamps: true,
})
export class University {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true, unique: true })
  domain: string;

  @Prop({ required: true, unique: true })
  creator: string;

  @Prop({ required: true, unique: true })
  webUrl: string;
}

export const UniversitySchema = SchemaFactory.createForClass(University);
