import { DbConnection } from '../database/index';
import UserModel from '../database/models/userModel';
import { Role } from '../database/models';
import Category from '../database/models/categoryEntity';

export async function beforeAllHook() {
  await DbConnection.instance.initializeDb();

  // Get repositories
  const userRepository = await DbConnection.connection.getRepository(UserModel);
  const roleRepository = await DbConnection.connection.getRepository(Role);
  const categoryRepository =
    await DbConnection.connection.getRepository(Category);

  // Delete all users,roles and categories
  await userRepository.createQueryBuilder().delete().execute();
  await roleRepository.createQueryBuilder().delete().execute();
  await categoryRepository.createQueryBuilder().delete().execute();
}

export async function afterAllHook() {
  const userRepository = DbConnection.connection.getRepository(UserModel);
  const repositoryUser = await userRepository.clear();

  const categoryRepository =
    await DbConnection.connection.getRepository(Category);
  const repositoryCategoty = await categoryRepository.clear();

  await DbConnection.instance.disconnectDb();
}
