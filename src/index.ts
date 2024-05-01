/* eslint-disable no-console */
import app from './app';
import { DbConnection } from './database';

const PORT = process.env.APP_PORT;

(async () => {
  // connecting to the database
  await DbConnection.instance.initializeDb();
  app.listen(PORT, () => console.log(`App is up and listening to ${PORT}`));
})();
