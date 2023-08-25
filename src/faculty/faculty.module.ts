import { Module } from '@nestjs/common';
import { FacultyController } from './faculty.controller';
import { FacultyService } from './faculty.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Faculty, FacultySchema } from './schema/faculty.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Faculty.name, schema: FacultySchema }]),
  ],
  providers: [FacultyService],
  controllers: [FacultyController],
})
export class FacultyModule {}
