import { Expense } from '../expenses.schema';

export interface ICreateList {
  name: string;
  expenses?: Expense[];
}
