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
exports.adminRoutes = void 0;
// src/routes/adminRoutes.ts
const express_1 = require("express");
const marked_1 = require("marked");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const publicRoutes_1 = require("./publicRoutes");
const pool = require('../db');
exports.adminRoutes = (0, express_1.Router)();
// Create a new post
exports.adminRoutes.post('/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, sub_title, category, type } = req.body;
    if (!req.user || !req.user.id) {
        return res.status(403).send('Unauthorized access - user not identified');
    }
    const user_id = req.user.id;
    if (type == null || type === '') {
        return res.status(400).send('Missing type');
    }
    try {
        const { rows } = yield pool.query('INSERT INTO posts (title, content, sub_title, category, type, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;', [title, content, sub_title, category, type, user_id]);
        const newPost = rows[0];
        res.status(200).json(newPost);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error creating the post');
    }
}));
// Delete a post
exports.adminRoutes.delete('/posts/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = parseInt(req.params.id);
    if (!req.user || !req.user.id) {
        return res.status(403).send('Unauthorized access - user not identified');
    }
    try {
        const fetchRes = yield pool.query('SELECT * FROM posts WHERE id = $1;', [postId]);
        if (fetchRes.rows.length === 0) {
            return res.status(404).send('Post not found');
        }
        // Check if the user ID associated with the post matches the authenticated user ID
        if (fetchRes.rows[0].user_id !== req.user.id) {
            return res.status(403).send('Unauthorized access - user not authorized to delete this post');
        }
        yield pool.query('DELETE FROM posts WHERE id = $1;', [postId]);
        res.json(fetchRes.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error deleting the post');
    }
}));
// Update a post
exports.adminRoutes.put('/posts/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = parseInt(req.params.id);
    const { title, content, sub_title, category, type } = req.body;
    if (!req.user || !req.user.id) {
        return res.status(403).json('Unauthorized access - user not identified');
    }
    try {
        const fetchRes = yield pool.query('SELECT * FROM posts WHERE id = $1;', [postId]);
        if (fetchRes.rows.length === 0) {
            return res.status(404).json('Post not found');
        }
        // Check if the user ID associated with the post matches the authenticated user ID
        if (fetchRes.rows[0].user_id !== req.user.id) {
            return res.status(403).json('Unauthorized access - user not authorized to update this post');
        }
        const { rows } = yield pool.query('UPDATE posts SET title = $1, content = $2, sub_title = $3, category = $4, type = $5 WHERE id = $6 RETURNING *;', [title, content, sub_title, category, type, postId]);
        res.json(rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json('Error updating the post');
    }
}));
// Get all posts for the authenticated user
exports.adminRoutes.get('/my-posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        return res.status(403).json('Unauthorized access - user not identified');
    }
    const user_id = req.user.id;
    try {
        const { rows } = yield pool.query('SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC;', [user_id]);
        const processedPosts = rows.map((post) => (Object.assign(Object.assign({}, post), { content: (0, sanitize_html_1.default)((0, marked_1.marked)(post.content), publicRoutes_1.sanitizeOptions) })));
        res.json(processedPosts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json('Error retrieving user posts');
    }
}));
