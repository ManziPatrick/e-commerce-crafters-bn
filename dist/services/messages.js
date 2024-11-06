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
exports.messageService = void 0;
const messages_1 = __importDefault(require("../database/models/messages"));
class MessageService {
    addMessage(name, email, content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = yield messages_1.default.create({ name, email, content });
                return newMessage;
            }
            catch (error) {
                throw new Error('Error adding message: ' + error.message);
            }
        });
    }
    getMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield messages_1.default.findAll();
                return messages;
            }
            catch (error) {
                throw new Error('Error retrieving messages: ' + error.message);
            }
        });
    }
}
exports.messageService = new MessageService();
