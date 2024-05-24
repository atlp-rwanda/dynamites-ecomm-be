/* eslint-disable no-console */
import app from './app';
import { DbConnection } from './database';

declare module 'express' {
  export interface Request {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: Record<string, any>;
  }
}

const PORT = process.env.PORT;

(async () => {
  // connecting to the database
  await DbConnection.instance.initializeDb();
  app.listen(PORT, () => console.log(`App is up and listening to ${PORT}`));
})();
