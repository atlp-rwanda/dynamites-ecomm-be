import { DbConnection } from '../database/index';
import { UserModel } from '../database/models/userModel';

export async function beforeAllHook() {
  await DbConnection.instance.initializeDb();
}

export async function afterAllHook() {
  const userRepository = DbConnection.connection.getRepository(UserModel);
  const repository = await userRepository.delete({});
  // eslint-disable-next-line no-console
  console.log(repository);

  DbConnection.instance.disconnectDb();
}
