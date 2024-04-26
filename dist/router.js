"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("./controller/user");
const route = (0, express_1.Router)();
route.post('/users', async (req, res) => { return res.status(201).json({ data: await (0, user_1.createUser)(req.body) }); });
route.get('/users', async (req, res) => { return res.status(200).json({ data: await (0, user_1.allUsers)() }); });
exports.default = route;
