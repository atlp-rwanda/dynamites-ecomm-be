import dotenv from 'dotenv';
dotenv.config();

type envData = {
  username?: string;
  password?: string;
  host?: string;
  port?: string;
  name?: string;
};
const env = process.env.NODE_ENV || 'development';
const development = {
  username: process.env.DB_USER_DEV,
  password: process.env.DB_PASSWORD_DEV,
  host: process.env.DB_HOST_DEV,
  port: process.env.DB_PORT_DEV,
  name: process.env.DB_NAME_DEV,
};
const test = {
  username: process.env.DB_USER_TEST,
  password: process.env.DB_PASSWORD_TEST,
  host: process.env.DB_HOST_TEST,
  port: process.env.DB_PORT_TEST,
  name: process.env.DB_NAME_TEST,
};
const staging = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME_DEV,
};
const production = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME_DEV,
};

const config: {
  [key: string]: envData;
} = {
  development,
  test,
  staging,
  production,
};

export default config[env];
