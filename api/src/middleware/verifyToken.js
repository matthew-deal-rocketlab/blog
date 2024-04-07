"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
const verifyToken = (req, res, next) => {
    const response = req.headers['authorization'];
    const token = response === null || response === void 0 ? void 0 : response.split(' ')[1];
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    if (!process.env.JWT_SECRET_KEY) {
        return res.status(500).send('Internal Server Error: JWT Secret Key not set');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
    }
    catch (error) {
        return res.status(401).send('Invalid Token');
    }
    next();
};
exports.default = verifyToken;
