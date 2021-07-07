import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Model } from 'mongoose';
import { ICreateUser } from './dto/create-user.dto';
import { IUpdateUser } from './dto/update-user.dto';
import { UserConfig, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserConfig.name)
    private readonly UserModel: Model<UserDocument>,
  ) {}

  async getById(_id: string) {
    return this.UserModel.findOne({ _id });
  }

  async getByEmail(email: string) {
    return this.UserModel.findOne({ email });
  }

  async create(data: ICreateUser) {
    const existingUser = await this.getByEmail(data.email);

    if (existingUser)
      throw new BadRequestException('create-user.user-already-exists');

    if (Object.values(data).some((value) => !value || !value.length))
      throw new BadRequestException('create-user.invalid-data');

    const hashedPassword = hashSync(data.password, genSaltSync());

    const newUser = new this.UserModel({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return { ...savedUser.toJSON() };
  }

  async update(userId: string, data: IUpdateUser) {
    const existingUser = await this.getById(userId);

    if (!existingUser)
      throw new BadRequestException('update-user.user-not-found');

    existingUser.name = data.name ? data.name.trim() : existingUser.name;
    existingUser.email = data.email
      ? data.email.trim().toLowerCase()
      : existingUser.email;
    existingUser.password = data.password
      ? hashSync(data.password, genSaltSync())
      : existingUser.password;

    const updatedUser = await existingUser.save();

    return { ...updatedUser.toJSON() };
  }

  async delete(userId: string) {
    const existingUser = await this.getById(userId);

    if (!existingUser)
      throw new BadRequestException('delete-user.user-not-found');

    const deleted = await this.UserModel.deleteOne({ _id: userId });

    return { deleted: deleted.n > 0, ...existingUser.toJSON() };
  }
}
