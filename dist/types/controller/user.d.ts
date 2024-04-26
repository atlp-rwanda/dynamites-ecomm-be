import { User } from '../database/models';
export declare const createUser: (data: any) => Promise<User>;
export declare const allUsers: () => Promise<User[]>;
