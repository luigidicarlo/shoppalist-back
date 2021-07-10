import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { ListsController } from './lists.controller';
import { ListConfig } from './lists.schema';
import { ListsService } from './lists.service';

@Module({
  controllers: [ListsController],
  exports: [ListsService],
  imports: [MongooseModule.forFeature([{ ...ListConfig }]), UsersModule],
  providers: [ListsService],
})
export class ListsModule {}
