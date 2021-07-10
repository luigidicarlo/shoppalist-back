import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../users/users.schema';
import { paginate } from '../utils/pagination.util';
import { ICreateList } from './dto/create-list.dto';
import { IUpdateList } from './dto/update-list.dto';
import { ListConfig, ListDocument } from './lists.schema';

@Injectable()
export class ListsService {
  constructor(
    @InjectModel(ListConfig.name)
    private readonly ListModel: Model<ListDocument>,
  ) {}

  async index(user: UserDocument, page: number, perPage: number) {
    const { currentPage, lastPage, documents } = await paginate<ListDocument>({
      page,
      limit: perPage,
      Model: this.ListModel,
      query: { userId: user.id },
    });

    return {
      currentPage,
      lastPage,
      lists: documents.map((doc) => ({ ...doc.toJSON() })),
      resource: '/lists',
    };
  }

  async show(user: UserDocument, listId: string) {
    const existingList = await this.ListModel.findOne({
      userId: user.id,
      _id: listId,
    });

    if (!existingList) throw new BadRequestException('lists.list-not-found');

    return { ...existingList.toJSON() };
  }

  async create(user: UserDocument, listData: ICreateList) {
    const newList = new this.ListModel({
      name: listData.name.trim(),
      userId: user.id,
    });

    const createdList = await newList.save();

    return { ...createdList.toJSON() };
  }

  async update(user: UserDocument, listId: string, listData: IUpdateList) {
    const existingList = await this.checkForExistingList(user.id, listId);

    existingList.name = listData.name
      ? listData.name.trim()
      : existingList.name;

    const updatedList = await existingList.save();

    return { ...updatedList.toJSON() };
  }

  async delete(user: UserDocument, listId: string) {
    const existingList = await this.checkForExistingList(user.id, listId);

    const deleted = await this.ListModel.deleteOne({
      userId: user.id,
      _id: listId,
    });

    if (deleted.n <= 0)
      throw new InternalServerErrorException('lists.could-not-delete');

    return { ...existingList.toJSON() };
  }

  async checkForExistingList(userId: string, listId: string) {
    const existingList = await this.ListModel.findOne({
      userId,
      _id: listId,
    });

    if (!existingList) throw new BadRequestException('lists.list-not-found');

    return existingList;
  }
}
