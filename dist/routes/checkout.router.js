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
const express_1 = __importDefault(require("express"));
const checkout_controller_1 = require("../controllers/checkout.controller");
const Payment_1 = require("../controllers/Payment");
const verfiyToken_1 = require("../middleware/verfiyToken");
const router = express_1.default.Router();
router.post('/checkout', checkout_controller_1.createOrder);
router.post("/payment/:id", verfiyToken_1.VerifyAccessToken, Payment_1.checkout);
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), Payment_1.webhook);
router.get("/success", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Succesfully");
}));
router.get("/cancel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Cancel");
}));
exports.default = router;
