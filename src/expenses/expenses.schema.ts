import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ListConfig } from '../lists/lists.schema';
import { UserConfig } from '../users/users.schema';

export type ExpenseDocument = Expense & Document;

@Schema({ timestamps: true })
export class Expense {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ListConfig.name })
  listId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: UserConfig.name })
  userId: string;

  @Prop({ trim: true, required: true })
  name: string;

  @Prop({ min: 0, default: 0 })
  quantity: number;

  @Prop({ default: 0 })
  price: number;
}

const ExpenseSchema = SchemaFactory.createForClass(Expense);

ExpenseSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_: ExpenseDocument, ret: ExpenseDocument) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const ExpenseConfig = {
  name: 'Expense',
  schema: ExpenseSchema,
  collection: 'expenses',
};
