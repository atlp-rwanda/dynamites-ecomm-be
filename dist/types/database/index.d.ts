import { DataSource } from 'typeorm';
declare const dbConnection: DataSource;
export default dbConnection;
export declare const connect: () => Promise<void>;
