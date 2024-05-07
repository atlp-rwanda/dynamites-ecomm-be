import { DbConnection } from '../database/index';
import UserModel from '../database/models/userModel';
import { Role } from '../database/models';

export async function beforeAllHook() {
  await DbConnection.instance.initializeDb();

  // Get repositories
  const userRepository = await DbConnection.connection.getRepository(UserModel);
  const roleRepository = await DbConnection.connection.getRepository(Role);

  // Delete all users and roles
  await userRepository.createQueryBuilder().delete().execute();
  await roleRepository.createQueryBuilder().delete().execute();
}

export async function afterAllHook() {
  const userRepository = DbConnection.connection.getRepository(UserModel);
  const repository = await userRepository.clear();
  // eslint-disable-next-line no-console
  console.log(repository);

  await DbConnection.instance.disconnectDb();
}