import { Expense } from '../expenses.schema';

export interface IUpdateList {
  name?: string;
  expenses?: Expense[];
}
