import { Users } from '../services/Users';

declare module '../types/ServiceMap' {
  interface ServiceMap {
    users: Users;
  }
}
