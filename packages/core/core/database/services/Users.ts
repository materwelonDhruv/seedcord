import mongoose from 'mongoose';

import { IDocument } from '../../library/types/Miscellaneous';
import { BaseService } from '../BaseService';
import { DatabaseModel } from '../decorators/DatabaseModel';
import { DatabaseService } from '../decorators/DatabaseService';

interface IUser extends IDocument {
  username: string;
}

@DatabaseService('users')
export class Users<Doc extends IUser = IUser> extends BaseService<Doc> {
  @DatabaseModel('users')
  public static schema = new mongoose.Schema<IUser>({
    username: { type: String, required: true, unique: true }
  });

  public test(): void {}
}

/* Declare Users to augment the ServiceMap */
declare module '../types/Services' {
  interface Services {
    users: Users;
  }
}
