import app from './src/app';
import { connect } from './src/database';

const PORT = process.env.APP_PORT;
(async () => {
  await connect();
  app.listen(PORT, () => console.log(`App is up and listening to ${PORT}`));
})();
