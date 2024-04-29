import { DbConnection } from '../database/index';

// Hook to run before all tests
export async function beforeAllHook() {
  // await connect();
  await DbConnection.instance.initializeDb();
}

// Hook to run after all tests
export async function afterAllHook() {
  DbConnection.instance.disconnectDb();
  // await disconnectTest();
}
