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
exports.allStores = exports.allRequests = exports.vendorOrder = exports.selectVendorInfo = exports.editVendor = exports.deletingVendor = exports.registerVendor = void 0;
const vendor_1 = __importDefault(require("../database/models/vendor"));
const vendorServices_1 = require("../services/vendorServices");
const user_1 = __importDefault(require("../database/models/user"));
const order_1 = __importDefault(require("../database/models/order"));
const sequelize_1 = require("sequelize");
const registerVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, storeName, address, TIN, bankAccount, paymentDetails } = req.body;
    if (!userId || !storeName || !address || !TIN || !bankAccount || !paymentDetails) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
    const user = yield user_1.default.findOne({ where: { userId: userId } });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    try {
        const insertVendor = yield vendor_1.default.create({
            userId: userId,
            storeName: storeName,
            address: address,
            TIN: TIN,
            bankAccount: bankAccount,
            paymentDetails
        });
        return res.status(200).json({ message: "Vendor requested successfully", vendor: insertVendor });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.registerVendor = registerVendor;
// Deleting vendor 
const deletingVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.id;
    try {
        yield (0, vendorServices_1.deleteVendorById)(vendorId);
        res.status(200).json({ message: "Vendor deleted successful" });
    }
    catch (error) {
        if (error.message === "Vendor not found") {
            res.status(404).json({ error: "Vendor not found" });
        }
        else {
            console.log("The error is: " + error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.deletingVendor = deletingVendor;
const editVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = req.body;
    const vendorId = req.params.id;
    try {
        const vendor = yield vendor_1.default.findOne({ where: { vendorId } });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        Object.keys(updates).forEach(key => {
            vendor[key] = updates[key];
        });
        const updatedVendor = yield vendor.save();
        res.status(200).json({ message: 'Vendor update success', vendor: updatedVendor });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.editVendor = editVendor;
const selectVendorInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = yield vendor_1.default.findOne({ where: { userId: req.params.id } });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.status(200).json({ vendor });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.selectVendorInfo = selectVendorInfo;
const getOrdersByVendorId = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.default.findAll({
            where: {
                products: {
                    [sequelize_1.Op.contains]: [{
                            vendorId: vendorId
                        }]
                }
            }
        });
        return orders;
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
});
const vendorOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vendorId } = req.params;
    try {
        // Fetch orders that contain products from the specified vendor
        const orders = yield order_1.default.findAll({
            where: {
                products: {
                    [sequelize_1.Op.contains]: [{
                            vendorId: vendorId
                        }]
                }
            }
        });
        const filteredOrders = orders.map(order => {
            const filteredProducts = order.products.filter(product => product.vendorId === vendorId);
            return Object.assign(Object.assign({}, order.toJSON()), { products: filteredProducts });
        });
        res.status(200).json(filteredOrders);
    }
    catch (error) {
        console.error("Error fetching vendor orders:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.vendorOrder = vendorOrder;
const allRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellers = yield vendor_1.default.findAll({ where: { status: 'pending' } });
        res.status(200).json(sellers);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.allRequests = allRequests;
const allStores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stores = yield vendor_1.default.findAll({ where: { status: 'approved' } });
        res.status(200).json(stores);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.allStores = allStores;
