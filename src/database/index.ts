/* eslint-disable no-console */
import { DataSource } from 'typeorm';
import config from '../config/db';

export class DbConnection {
  private static _instance: DbConnection;
  private static dbConnection = new DataSource({
    type: 'postgres',
    logging: false,
    synchronize: false,
    // host: config.host,
    // port: Number(config.port as string),
    // username: config.username,
    // password: config.password,
    // database: config.name,
    url: 'postgres://dynamites_user:q5ivjQLaUf5nPPYQtNoffhTvun7ZXLsj@dpg-coumqf0l6cac73b79ahg-a/dynamites',
    migrations: [__dirname + '/migrations/'],
    entities: [__dirname + '/models/*{.js,.ts}'],
    // ssl: { rejectUnauthorized: false },
  });

  private constructor() {}

  public static get instance(): DbConnection {
    if (!this._instance) this._instance = new DbConnection();

    return this._instance;
  }

  public static get connection(): DataSource {
    return this.dbConnection;
  }

  initializeDb = async () => {
    try {
      console.log('=>db-configurations=>', JSON.stringify(config, null, 2));
      const connection = await DbConnection.dbConnection.initialize();
      console.log('db-connection', connection.options.database);
    } catch (error) {
      console.log('db-error', error);
    }
  };

  disconnectDb = async () => {
    try {
      await DbConnection.dbConnection.destroy();
      // console.log('db-disconnected', dbConnection.options.database);
    } catch (error) {
      console.log('Failed to disconnect from the test-db', error);
    }
  };
}

const dbConnection = DbConnection.connection;

export default dbConnection;
