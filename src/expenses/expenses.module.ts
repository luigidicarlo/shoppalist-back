import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListsModule } from '../lists/lists.module';
import { UsersModule } from '../users/users.module';
import { ExpensesController } from './expenses.controller';
import { ExpenseConfig } from './expenses.schema';
import { ExpensesService } from './expenses.service';

@Module({
  controllers: [ExpensesController],
  imports: [
    MongooseModule.forFeature([{ ...ExpenseConfig }]),
    UsersModule,
    ListsModule,
  ],
  providers: [ExpensesService],
})
export class ExpensesModule {}
