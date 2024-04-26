"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const dabasePort = process.env.PORT ? parseInt(process.env.PORT) : undefined;
const dbConnection = new typeorm_1.DataSource({
    type: 'postgres',
    logging: false,
    synchronize: true,
    host: process.env.DB_HOST,
    port: dabasePort,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    migrations: [__dirname + '/migrations/'],
    entities: [__dirname + '/models/*{.js,.ts}']
});
exports.default = dbConnection;
const connect = async () => {
    try {
        const connection = await dbConnection.initialize();
        console.log('db-connection', connection.options.database);
    }
    catch (error) {
        console.log('db-error', error);
    }
};
exports.connect = connect;
