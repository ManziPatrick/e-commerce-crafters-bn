"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const verfiyToken_1 = require("../middleware/verfiyToken");
const orderStatus_controller_1 = require("../controllers/orderStatus.controller");
const router = express_1.default.Router();
router.put("/order/:orderId/order-status", orderStatus_controller_1.updateOrderStatus);
router.get("/order/:orderId/status", orderStatus_controller_1.getOrderStatus);
router.put("/order/:orderId/product/:productId/status", orderController_1.modifyOrderStatus);
router.get("/order/getAllOrder", orderController_1.getAllOrder);
router.get("/order/getOrder/:orderId", orderController_1.getOrder);
router.get("/order/getSellerOrder/:vendorId", orderController_1.getSellerOrder);
router.get("/orders", verfiyToken_1.VerifyAccessToken, orderController_1.getAllOrders);
router.get("/order/getSellerOrder/:vendorId", orderController_1.getSellerOrder);
exports.default = router;
