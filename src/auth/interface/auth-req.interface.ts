import { Request } from 'express';
import { UserDocument } from '../../users/users.schema';

export interface IAuthReq extends Request {
  user?: UserDocument;
}
