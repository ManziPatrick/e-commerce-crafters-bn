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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.addMessage = void 0;
const messages_1 = require("../services/messages");
//add message
const addMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, content } = req.body;
        if (!name || !email || !content) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const newMessage = yield messages_1.messageService.addMessage(name, email, content);
        return res.status(201).json(newMessage);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.addMessage = addMessage;
// Get all messages
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield messages_1.messageService.getMessages();
        return res.status(200).json(messages);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getMessages = getMessages;
