import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListsService } from '../lists/lists.service';
import { ICreateExpense } from './dto/create-expense.dto';
import { IUpdateExpense } from './dto/update-expense.dto';
import { ExpenseConfig, ExpenseDocument } from './expenses.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(ExpenseConfig.name)
    private readonly ExpenseModel: Model<ExpenseDocument>,
    private readonly listsService: ListsService,
  ) {}

  async index(userId: string, listId: string) {
    const list = await this.listsService.checkForExistingList(userId, listId);

    if (!list)
      throw new UnauthorizedException('expenses.list-does-not-belong-to-user');

    const expenses = await this.ExpenseModel.find({ listId });

    return {
      expenses: expenses.map((expense) => ({ ...expense.toJSON() })),
      list: { ...list.toJSON() },
    };
  }

  async show(userId: string, listId: string, expenseId: string) {
    const list = await this.listsService.checkForExistingList(userId, listId);

    const expense = await this.ExpenseModel.findOne({ listId, _id: expenseId });

    if (!expense) throw new BadRequestException('expenses.no-expense-found');

    return {
      expense: { ...expense.toJSON() },
      list: { ...list.toJSON() },
    };
  }

  async create(userId: string, data: ICreateExpense) {
    const list = await this.listsService.checkForExistingList(
      userId,
      data.listId,
    );

    const newExpense = new this.ExpenseModel({
      listId: list.id,
      userId,
      name: data.name.trim(),
      quantity: Number(data.quantity),
      price: Number(data.price),
    });

    const createdExpense = await newExpense.save();

    return { ...createdExpense.toJSON() };
  }

  async update(userId: string, expenseId: string, data: IUpdateExpense) {
    const expense = await this.checkExpenseOwnership(userId, expenseId);

    expense.name = data.name ? data.name.trim() : expense.name;
    expense.quantity = data.quantity ? Number(data.quantity) : expense.quantity;
    expense.price = data.price ? Number(data.price) : expense.price;

    const updatedExpense = await expense.save();

    return { ...updatedExpense.toJSON() };
  }

  async delete(userId: string, expenseId: string) {
    const expense = await this.checkExpenseOwnership(userId, expenseId);

    const deleted = await this.ExpenseModel.deleteOne({
      userId,
      _id: expense.id,
    });

    if (deleted.n <= 0)
      throw new InternalServerErrorException('expenses.could-not-delete');

    return { ...expense.toJSON() };
  }

  private async checkExpenseOwnership(userId: string, expenseId: string) {
    const expense = await this.ExpenseModel.findOne({ userId, _id: expenseId });

    if (!expense)
      throw new UnauthorizedException(
        'expenses.expense-does-not-belong-to-user',
      );

    return expense;
  }
}
