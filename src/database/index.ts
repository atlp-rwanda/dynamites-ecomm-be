import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

const dbConnection = new DataSource({
  type: 'postgres',
  logging: false,
  synchronize: true,
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  migrations: [__dirname + '/migrations/'],
  entities: [__dirname + '/models/*{.js,.ts}']
});

export default dbConnection;

export const connect = async () => {
    try {
      const connection = await dbConnection.initialize();
      console.log('db-connection', connection.options.database);
    } catch (error) {
      console.log('db-error', error);
    }
  };