import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();
const dabasePort = process.env.DB_PORT
  ? parseInt(process.env.DB_PORT)
  : undefined;

const dbTestConnection = new DataSource({
  type: 'postgres',
  logging: false,
  synchronize: true,
  host: process.env.TEST_DB_HOST,
  port: dabasePort,
  username: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASS,
  database: process.env.TEST_DB_NAME,
  migrations: [__dirname + '/migrations/'],
  entities: [__dirname + '/models/*{.js,.ts}'],
});

export default dbTestConnection;

// Function to connect to the test database
export const connectTest = async () => {
  try {
    const connection = await dbTestConnection.initialize(); 
    console.log(
      'You are connected to the test-db',
      connection.options.database
    );
  } catch (error) {
    console.log('Failed to connect to the test-db', error); 
  }
};

// Function to disconnect from the test database
export const disconnectTest = async () => {
  try {
    await dbTestConnection.close(); 
    console.log('Disconnected from the test-db'); 
  } catch (error) {
    console.log('Failed to disconnect from the test-db', error); 
  }
};