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
exports.sanitizeOptions = exports.publicRoutes = void 0;
const express_1 = require("express");
const marked_1 = require("marked");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const pool = require('../db');
exports.publicRoutes = (0, express_1.Router)();
exports.sanitizeOptions = {
    allowedTags: sanitize_html_1.default.defaults.allowedTags.concat(['img']),
    allowedAttributes: Object.assign(Object.assign({}, sanitize_html_1.default.defaults.allowedAttributes), { img: ['src', 'alt', 'title'], span: ['class', 'style'] }),
};
// Get all posts
exports.publicRoutes.get('/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield pool.query('SELECT * FROM posts WHERE type = $1 ORDER BY created_at DESC ', ['public']);
        const processedPosts = rows.map((post) => (Object.assign(Object.assign({}, post), { content: (0, sanitize_html_1.default)((0, marked_1.marked)(post.content), exports.sanitizeOptions) })));
        res.json(processedPosts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json('Error retrieving posts');
    }
}));
// Get a single post using marked
exports.publicRoutes.get('/posts/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { rows } = yield pool.query('SELECT * FROM posts WHERE id = $1;', [id]);
        if (rows.length === 0) {
            return res.status(404).json('Post not found');
        }
        const post = rows[0];
        // Convert markdown content to HTML
        const htmlContent = (0, marked_1.marked)(post.content);
        // Sanitize the HTML content
        const safeHtmlContent = (0, sanitize_html_1.default)(htmlContent, exports.sanitizeOptions);
        // Return the post with HTML content
        res.json(Object.assign(Object.assign({}, post), { content: safeHtmlContent }));
    }
    catch (error) {
        console.error(error);
        res.status(500).json('Error retrieving the post');
    }
}));
