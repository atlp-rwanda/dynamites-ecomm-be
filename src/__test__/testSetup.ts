import { DbConnection } from '../database/index';
import { UserModel } from '../database/models/userModel';

import { Role } from '../database/models';

export async function beforeAllHook() {
  await DbConnection.instance.initializeDb();
  // removing all data from role table
  const roleRepository = await DbConnection.connection.getRepository(Role);
  await roleRepository.createQueryBuilder().delete().execute();
}

export async function afterAllHook() {
  // await DbConnection.instance.disconnectDb();
  // await disconnectTest();
  const userRepository = DbConnection.connection.getRepository(UserModel);
  const repository = await userRepository.delete({});
  // eslint-disable-next-line no-console
  console.log(repository);

  await DbConnection.instance.disconnectDb();
}
