import request from 'supertest';
import app from '../app';
import { connectTest, disconnectTest } from '../database/testDatabase';

jest.setTimeout(50000);

// Hook to run before all tests
export async function beforeAllHook() {
  await connectTest();
}

// Hook to run after all tests
export async function afterAllHook() {
  await disconnectTest();
}
