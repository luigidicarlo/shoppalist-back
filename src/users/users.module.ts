import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserConfig } from './users.schema';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forFeature([{ ...UserConfig }])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
