"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUsers = exports.createUser = void 0;
const database_1 = __importDefault(require("../database"));
const models_1 = require("../database/models");
const userRepository = database_1.default.getRepository(models_1.User);
const createUser = async (data) => {
    const user = new models_1.User();
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.age = data.age;
    return await userRepository.save(user);
};
exports.createUser = createUser;
const allUsers = async () => {
    return await userRepository.find();
};
exports.allUsers = allUsers;
