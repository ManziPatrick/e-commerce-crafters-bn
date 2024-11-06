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
exports.getLatestMessages = exports.getAllVendors = exports.getVendors = exports.getAllMessage = exports.sendMessage = void 0;
const chatmessage_1 = __importDefault(require("../database/models/chatmessage"));
const pusher_1 = __importDefault(require("../pusher"));
const vendor_1 = __importDefault(require("../database/models/vendor"));
const user_1 = __importDefault(require("../database/models/user"));
const sequelize_1 = require("sequelize");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, imageUrl, sender, receiver } = req.body;
        if (!content && !imageUrl) {
            return res.status(400).json({ message: "Please provide content or image" });
        }
        if (!sender || !receiver) {
            return res.status(400).json({ message: "Please provide sender or receiver" });
        }
        const senderData = yield user_1.default.findByPk(sender, {
            include: {
                model: vendor_1.default,
                as: "Vendor"
            }
        });
        const newMessage = yield chatmessage_1.default.create({
            content,
            imageUrl,
            sender,
            receiver
        });
        if (!newMessage) {
            return res.status(400).json({ message: "Message not sent" });
        }
        pusher_1.default.trigger("user", "send-user", {
            sender: senderData,
            message: newMessage
        });
        pusher_1.default.trigger("message", "new-message", {
            message: newMessage,
            user: senderData,
        });
        return res.status(200).json({ message: 'message sent' });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.sendMessage = sendMessage;
const getAllMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield chatmessage_1.default.findAll();
        if (messages.length > 0) {
            return res.status(200).json({ messages });
        }
        return res.status(200).json({ message: "No messages" });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.getAllMessage = getAllMessage;
const getVendors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const vendors = yield user_1.default.findAll({ include: [
                {
                    model: vendor_1.default,
                    as: "Vendor"
                }
            ] });
        const responseVendor = [];
        for (const vendor of vendors) {
            const messages = yield chatmessage_1.default.findOne({ where: {
                    [sequelize_1.Op.or]: [
                        { receiver: vendor.userId, sender: userId },
                        { sender: vendor.userId, receiver: userId }
                    ]
                } });
            if (messages) {
                responseVendor.push(vendor);
            }
        }
        if (responseVendor.length < 1) {
            return res.status(400).json({ message: "No vendors found" });
        }
        return res.status(200).json({ vendors: responseVendor });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getVendors = getVendors;
const getAllVendors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield user_1.default.findAll({ where: { role: "vendor" }, include: [
                {
                    model: vendor_1.default,
                    as: "Vendor"
                }
            ] });
        return res.status(200).json({ vendors });
    }
    catch (error) {
        res.status(500).json({ message: "Inter server error" });
    }
});
exports.getAllVendors = getAllVendors;
const getLatestMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const vendors = yield vendor_1.default.findAll();
        const vendorMessages = yield Promise.all(vendors.map((vendor) => __awaiter(void 0, void 0, void 0, function* () {
            const latestMessage = yield chatmessage_1.default.findOne({
                // where: {
                //     [Op.or]: [
                //         { sender: vendor.userId, receiver: userId },
                //         { sender: userId, receiver: vendor.userId },
                //     ],
                // },
                order: [['createdAt', 'DESC']],
            });
            return {
                vendor,
                latestMessage,
            };
        })));
        res.status(200).json(vendorMessages);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getLatestMessages = getLatestMessages;
