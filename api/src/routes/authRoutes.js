"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const pool = require('../db');
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = require("express");
exports.authRoutes = (0, express_1.Router)();
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    return bcrypt_1.default.hash(password, saltRounds);
});
exports.authRoutes.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const hashedPassword = yield hashPassword(password);
    try {
        const result = yield pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;', [email, hashedPassword]);
        // If the user was successfully inserted, return the user data
        res.json({ user: result.rows[0], message: 'User registered successfully.' });
    }
    catch (error) {
        console.error(error);
        // Check if the error message indicates a duplicate key violation
        if (error.message.includes('duplicate key')) {
            return res.status(409).json({ error: 'User already exists' });
        }
        console.error(error);
        res.status(500).json({ error: 'Error creating new user' });
    }
}));
exports.authRoutes.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const { rows } = yield pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Wrong email or password' });
        }
        const user = rows[0];
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Wrong email or password' });
        }
        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ error: 'Internal Server Error: JWT Secret Key not set' });
        }
        // Access token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY, {
            expiresIn: '2h',
        });
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error during login' });
    }
}));
