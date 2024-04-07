"use strict";
// src/routes/adminRoutes.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const pool = require('../db');
exports.userRoutes = (0, express_1.Router)();
// get user by id
exports.userRoutes.get('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    try {
        const { rows } = yield pool.query('SELECT * FROM users WHERE id = $1;', [userId]);
        if (rows.length === 0) {
            return res.status(404).json('User not found');
        }
        res.json(rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json('Error retrieving the user');
    }
}));
