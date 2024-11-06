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
exports.getSellerOrder = exports.getOrder = exports.getAllOrder = exports.getAllOrders = exports.modifyOrderStatus = void 0;
const order_1 = __importDefault(require("../database/models/order"));
const orderStatus_1 = require("../services/orderStatus");
const product_1 = __importDefault(require("../database/models/product"));
const allowedStatuses = ["pending", "delivered", "cancelled"];
const modifyOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, productId } = req.params;
        const { status } = req.body;
        const userId = req.token.id;
        const vendor = yield (0, orderStatus_1.findVendorByUserId)(userId);
        if (!vendor) {
            return res.status(404).json({ message: "No vendor found" });
        }
        if (!vendor) {
            return res.status(404).json({ message: "No vendor found" });
        }
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid order status" });
        }
        const order = yield order_1.default.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        let isOrderDelivered = true;
        const updatedProducts = order.products.map((item) => {
            if (item.productId === productId) {
                item.status = status;
            }
            if (item.status !== "delivered") {
                isOrderDelivered = false;
            }
            return item;
        });
        order.products = updatedProducts;
        order.status = isOrderDelivered ? "delivered" : "pending";
        yield order_1.default.update({ products: updatedProducts, status: order.status }, { where: { orderId: orderId } });
        const updatedOrder = yield order_1.default.findByPk(orderId);
        return res.status(200).json({
            message: `Product status has been updated to ${status.toLowerCase()}`,
            order: updatedOrder,
        });
    }
    catch (error) {
        console.error(`Failed to update product status: ${error}`);
        res.status(500).json({ error: error.message });
    }
});
exports.modifyOrderStatus = modifyOrderStatus;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.token.id;
        const vendorId = req.params.vendorId;
        let orders;
        orders = yield order_1.default.findAll({ where: { userId } });
        return res.status(200).json(orders);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getAllOrders = getAllOrders;
const getAllOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield order_1.default.findAll();
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal error server" });
    }
});
exports.getAllOrder = getAllOrder;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId;
        const order = yield order_1.default.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        return res.status(200).json(order);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.getOrder = getOrder;
const getSellerOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorId = req.params.vendorId;
        const orders = yield order_1.default.findAll();
        if (!orders) {
            return res.status(404).json({ message: "No order found" });
        }
        const products = [];
        for (const order of orders) {
            for (const data of order.products) {
                const single_product = yield product_1.default.findOne({
                    where: { productId: data.productId },
                });
                if ((single_product === null || single_product === void 0 ? void 0 : single_product.vendorId) === vendorId) {
                    products.push(order);
                }
            }
        }
        console.log("products_____:", products);
        res.status(200).send(products);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal error server" });
    }
});
exports.getSellerOrder = getSellerOrder;
