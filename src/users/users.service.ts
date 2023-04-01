import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User, UserDocument } from './schemas';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(userDto: CreateUserDto) {
    return this.userModel.create(userDto);
  }

  findOne(id: Types.ObjectId) {
    if (!id) return null;
    return this.userModel.findById(id);
  }

  findOneBy(obj) {
    return this.userModel.findOne(obj);
  }

  find(email: string, mobile: string) {
    return this.userModel.find({ $or: [{ email }, { mobile }] });
  }

  async update(id: Types.ObjectId, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    return this.userModel.findByIdAndUpdate(id, attrs, { runValidators: true });
  }

  async remove(id: Types.ObjectId) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    return this.userModel.deleteOne({ _id: id });
  }
}
