import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UniversityService } from './university.service';
import { UniversityController } from './university.controller';
import { University, UniversitySchema } from './schema/university.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: University.name, schema: UniversitySchema },
    ]),
  ],
  providers: [UniversityService],
  controllers: [UniversityController],
})
export class UniversityModule {}
