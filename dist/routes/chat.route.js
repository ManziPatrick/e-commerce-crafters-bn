"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Chat_controller_1 = require("../controllers/Chat.controller");
const Router = express_1.default.Router();
Router.post("/chat", Chat_controller_1.sendMessage);
Router.get("/get-message", Chat_controller_1.getAllMessage);
Router.get("/get-vendor/:id", Chat_controller_1.getVendors);
Router.get("/get-all-vendor", Chat_controller_1.getAllVendors);
Router.get("/get-latestMessage/:id", Chat_controller_1.getLatestMessages);
exports.default = Router;
