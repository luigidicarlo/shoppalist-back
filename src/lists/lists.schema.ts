import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserConfig } from '../users/users.schema';

export type ListDocument = List & Document;

@Schema({ timestamps: true })
export class List {
  @Prop({ trim: true, required: true })
  name: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: UserConfig.name,
    required: true,
  })
  userId: string;
}

const ListSchema = SchemaFactory.createForClass(List);

ListSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_: ListDocument, ret: ListDocument) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const ListConfig = {
  name: 'List',
  schema: ListSchema,
  collection: 'lists',
};
