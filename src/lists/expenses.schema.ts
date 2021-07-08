import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Expense {
  @Prop({ trim: true, required: true })
  name: string;

  @Prop({ min: 0, default: 0 })
  quantity: number;

  @Prop({ default: 0 })
  price: number;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
