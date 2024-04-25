import dbConnection from '../database';
import {User} from '../database/models';

const userRepository = dbConnection.getRepository(User)

export const createUser = async(data:any) => {
    const user = new User()
    user.firstName = data.firstName
    user.lastName = data.lastName
    user.age = data.age
    return await userRepository.save(user)
}
export const allUsers = async() => {
    return await userRepository.find();
}