import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';

import { UniveristyDocument, University } from './schema/university.schema';
import { CreateUniDto, EditUniDto } from './dto';

@Injectable()
export class UniversityService {
  constructor(
    @InjectModel(University.name) private uniModel: Model<UniveristyDocument>,
  ) {}

  async create(userId: string, dto: CreateUniDto) {
    const newUniversity = new this.uniModel({
      name: dto.name,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      domain: dto.domain,
      webUrl: dto.webUrl,
      creator: userId,
    });

    await newUniversity.save();
    return { message: 'University created successfully' };
  }

  async findById(uniId: any): Promise<UniveristyDocument> {
    const university = await this.uniModel.findById({ _id: uniId }).exec();
    if (!university) {
      throw new NotFoundException('University not found');
    }
    return university;
  }

  async findAll(query: ExpressQuery): Promise<UniveristyDocument[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page);
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const universities = await this.uniModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return universities;
  }

  async update(
    userId: any,
    uniId: string,
    dto: EditUniDto,
  ): Promise<UniveristyDocument> {
    const university = await this.uniModel.findById({ _id: uniId });

    if (!university) {
      throw new NotFoundException({
        status: 'false',
        message: 'University does not exists',
      });
    }
    const updateUniversity = await this.uniModel
      .findByIdAndUpdate(uniId, { $set: dto }, { new: true })
      .exec();

    return updateUniversity;
  }

  async delete(userId: any, uniId: string) {
    const university = await this.uniModel.findById({ _id: uniId });

    if (!university) {
      throw new NotFoundException({
        status: 'false',
        message: 'University does not exists',
      });
    }
    if (university.creator !== userId) {
      throw new ForbiddenException({
        status: 'false',
        message: 'Access to resource denied',
      });
    }

    await university.deleteOne();
    return { message: 'University deleted successfully' };
  }
}
