import app from './src/app';
import { connect } from './src/database';

const PORT = process.env.APP_PORT;

// Immediately invoked async function to start the server
(async () => {
  // Establish a connection to the database
  await connect();

  app.listen(PORT, () => console.log(`App is up and listening to ${PORT}`));
})();
