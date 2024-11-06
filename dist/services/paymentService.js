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
exports.findProductById = exports.findOrderById = void 0;
const order_1 = __importDefault(require("../database/models/order"));
const product_1 = __importDefault(require("../database/models/product"));
const findOrderById = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_1.default.findByPk(orderId);
    return order;
});
exports.findOrderById = findOrderById;
const findProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_1.default.findByPk(productId);
    return product;
});
exports.findProductById = findProductById;
