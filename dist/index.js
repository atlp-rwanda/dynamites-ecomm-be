"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerconfig_1 = __importDefault(require("./docs/swaggerconfig"));
require("reflect-metadata");
const database_1 = require("./database");
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("dev"));
app.use(process.env.ALL, router_1.default);
app.use(process.env.DOCS, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerconfig_1.default));
app.get('/', (req, res) => res.json({ message: 'Welcome To The Dynamites backend e-commerce' }));
const PORT = process.env.APP_PORT;
(async () => {
    await (0, database_1.connect)();
    app.listen(PORT, () => console.log(`App is up and listening to ${PORT}`));
})();
