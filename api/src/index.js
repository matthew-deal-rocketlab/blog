"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const verifyToken_1 = __importDefault(require("./middleware/verifyToken"));
const adminRoutes_1 = require("./routes/adminRoutes");
const authRoutes_1 = require("./routes/authRoutes");
const publicRoutes_1 = require("./routes/publicRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const app = (0, express_1.default)();
const PORT = 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api', authRoutes_1.authRoutes);
app.use('/api', publicRoutes_1.publicRoutes);
app.use('/api', verifyToken_1.default, adminRoutes_1.adminRoutes);
app.use('/api', verifyToken_1.default, userRoutes_1.userRoutes);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
