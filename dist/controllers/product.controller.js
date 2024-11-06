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
exports.getPopularProduct = exports.viewProducts = exports.deleteProduct = exports.updateProduct = exports.searchProduct = exports.readAllProducts = exports.similarProducts = exports.readProduct = exports.createProduct = void 0;
const productService_1 = require("../services/productService");
const product_1 = __importDefault(require("../database/models/product"));
const cartitem_1 = __importDefault(require("../database/models/cartitem"));
const PermisionService_1 = require("../services/PermisionService");
const events_1 = require("../helpers/events");
const vendor_1 = __importDefault(require("../database/models/vendor"));
const productService_2 = require("../services/productService");
const productService_3 = require("../services/productService");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenData = req.token;
        const vendorId = req.params.id;
        const permissionCheck = yield (0, PermisionService_1.checkVendorPermission)(tokenData, vendorId);
        if (!permissionCheck.allowed) {
            return res
                .status(permissionCheck.status)
                .json({ message: permissionCheck.message });
        }
        const { name, image, description, discount, price, quantity, category, expiringDate, } = req.body;
        console.log(image);
        if (!name || !image || !description || !price || !quantity || !category) {
            return res.status(200).json("All Field are required");
        }
        if (!Array.isArray(image) || image.length !== 4) {
            return res.status(400).json({ message: "Exactly 4 images are required" });
        }
        const data = {
            name,
            image: image,
            description,
            discount: discount ? discount : 0,
            price,
            quantity,
            category,
            vendorId: vendorId,
            expiringDate,
        };
        const save = yield (0, productService_1.saveProduct)(data);
        if (!save) {
            return res.status(500).json({ error: "Failed to save data" });
        }
        events_1.productLifecycleEmitter.emit(events_1.PRODUCT_ADDED, data);
        return res.status(201).json({ message: "Product Created", data: save });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createProduct = createProduct;
const readProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const product = yield product_1.default.findByPk(productId, {
            include: {
                model: vendor_1.default,
                as: "Vendor",
            },
        });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.readProduct = readProduct;
const similarProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const product = yield (0, productService_2.getProductById)(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        const category = product.category;
        const similarProducts = yield (0, productService_3.fetchSimilarProducts)(productId, category);
        if (similarProducts.length === 0) {
            return res.status(404).json({ error: "No similar products found" });
        }
        console.log("hhhhhhhhhh", similarProducts);
        return res.status(200).json(similarProducts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.similarProducts = similarProducts;
// delete product
const readAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const products = yield (0, productService_1.getAllProducts)(page, limit);
        if (products.length === 0) {
            return res.status(404).json({ error: "No products found" });
        }
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.readAllProducts = readAllProducts;
const searchProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, category } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const criteria = {};
        if (name)
            criteria.name = name;
        if (category)
            criteria.category = category;
        const products = yield (0, productService_1.searchProducts)(criteria, page, limit);
        if (products.length === 0) {
            return res.status(404).json({ error: "No products found" });
        }
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.searchProduct = searchProduct;
// update product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenData = req.token;
        const { vendorId } = req.body;
        const productId = req.params.id;
        const permissionCheck = yield (0, PermisionService_1.checkVendorModifyPermission)(tokenData, vendorId);
        if (!permissionCheck.allowed) {
            return res
                .status(permissionCheck.status)
                .json({ message: permissionCheck.message });
        }
        const updateData = req.body;
        const product = yield product_1.default.findByPk(productId);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        yield product.update(updateData);
        events_1.productLifecycleEmitter.emit(events_1.PRODUCT_UPDATED, product);
        res.status(200).json({ message: "Product updated successfully", product });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateProduct = updateProduct;
// delete product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenData = req.token;
        const productId = req.params.id;
        const { vendorId } = req.body;
        console.log(productId);
        const permissionCheck = yield (0, PermisionService_1.checkVendorModifyPermission)(tokenData, vendorId);
        if (!permissionCheck.allowed) {
            return res
                .status(permissionCheck.status)
                .json({ message: permissionCheck.message });
        }
        const product = yield product_1.default.findByPk(productId);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        yield product.destroy();
        events_1.productLifecycleEmitter.emit(events_1.PRODUCT_REMOVED, product);
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteProduct = deleteProduct;
const viewProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenData = req.token;
        const vendorId = req.params.id;
        const permissionCheck = yield (0, PermisionService_1.checkVendorPermission)(tokenData, vendorId);
        if (!permissionCheck.allowed) {
            return res
                .status(permissionCheck.status)
                .json({ message: permissionCheck.message });
        }
        const products = yield product_1.default.findAll({
            where: { vendorId: vendorId },
        });
        if (!products.length) {
            res.status(404).json({ message: "No products found" });
            return;
        }
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.viewProducts = viewProducts;
//get popular products
const getPopularProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const products = yield product_1.default.findAll({
            include: { model: cartitem_1.default, as: "CartItem" },
        });
        if (!products) {
            res.status(404).json({ message: "No products found" });
        }
        for (let i = 0; i <= products.length; i++) {
            for (let b = i + 1; b <= products.length; b++) {
                if (((_b = (_a = products[i]) === null || _a === void 0 ? void 0 : _a.CartItem) === null || _b === void 0 ? void 0 : _b.length) < ((_d = (_c = products[b]) === null || _c === void 0 ? void 0 : _c.CartItem) === null || _d === void 0 ? void 0 : _d.length)) {
                    let temp = products[i];
                    products[i] = products[b];
                    products[b] = temp;
                }
            }
        }
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getPopularProduct = getPopularProduct;
