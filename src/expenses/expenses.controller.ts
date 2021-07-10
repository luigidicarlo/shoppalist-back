import {
  Controller,
  Get,
  Req,
  UseGuards,
  Query,
  Post,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { IAuthReq } from '../auth/interface/auth-req.interface';
import { ICreateExpense } from './dto/create-expense.dto';
import { IUpdateExpense } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@Controller('/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @UseGuards(JwtGuard)
  @Get()
  async indexOrShow(
    @Req() req: IAuthReq,
    @Query('list') listId?: string,
    @Query('expense') expenseId?: string,
  ) {
    if (listId?.length > 0 && expenseId?.length > 0) {
      return this.expensesService.show(req.user.id, listId, expenseId);
    } else if (listId?.length > 0) {
      return this.expensesService.index(req.user.id, listId);
    } else {
      return [];
    }
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req: IAuthReq) {
    return this.expensesService.create(req.user.id, req.body as ICreateExpense);
  }

  @UseGuards(JwtGuard)
  @Patch('/:expense')
  async update(@Req() req: IAuthReq, @Param('expense') expenseId: string) {
    return this.expensesService.update(
      req.user.id,
      expenseId,
      req.body as IUpdateExpense,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('/:expense')
  async delete(@Req() req: IAuthReq, @Param('expense') expenseId: string) {
    return this.expensesService.delete(req.user.id, expenseId);
  }
}
