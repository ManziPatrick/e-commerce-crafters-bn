"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("../controllers/message.controller");
const router = (0, express_1.Router)();
router.post('/addMessage', message_controller_1.addMessage);
router.get('/getMessages', message_controller_1.getMessages);
exports.default = router;
