/* eslint-disable no-console */
import app from './app';
import { DbConnection } from './database';
import cron_tasks from '../src/Notification.vendor/node.cron.services' 


declare module 'express-serve-static-core' {
  interface Request {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: Record<string, any>;
    files?: {
      image?: Express.Multer.File[];
    };
  }
}

const PORT = process.env.PORT;

(async () => {
  // connecting to the database
  await DbConnection.instance.initializeDb();

  app.listen(PORT, () => console.log(`App is up and listening to ${PORT}`));

  cron_tasks.start()
})();
