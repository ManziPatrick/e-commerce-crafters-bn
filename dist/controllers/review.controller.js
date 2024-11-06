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
exports.sales_products = exports.deleteReview = exports.addFeedback = exports.view_vendor_feedback = exports.selectFeedback = exports.selectReview = exports.addReview = void 0;
const order_1 = __importDefault(require("../database/models/order"));
const review_1 = __importDefault(require("../database/models/review"));
const models_1 = __importDefault(require("../database/models"));
const rating_1 = __importDefault(require("../database/models/rating"));
const product_1 = __importDefault(require("../database/models/product"));
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { productId, rating, feedback } = req.body;
        if (rating && rating > 5) {
            return res.status(402).json({ message: "Rating is between 0 and 5" });
        }
        const viewOrder = yield order_1.default.findOne({
            where: {
                userId,
                products: {
                    productId,
                },
            },
        });
        if (!viewOrder) {
            return res
                .status(400)
                .json({ message: " User has not bougth this product" });
        }
        const addReview = yield review_1.default.create({
            userId,
            productId,
            rating,
            feedback,
        });
        res
            .status(200)
            .json({ message: "Review created successfully", review: addReview });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.addReview = addReview;
const selectReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorId = req.params.id;
        const review = yield review_1.default.findAll({
            include: [
                {
                    model: models_1.default.Product,
                    where: { vendorId: vendorId },
                },
            ],
        });
        if (!review || review.length === 0) {
            return res
                .status(400)
                .json({ message: "There in no review in your products" });
        }
        return res.status(200).json({ review: review });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.selectReview = selectReview;
const selectFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const ratings = yield rating_1.default.findAll({
            where: {
                productId
            },
            order: [['createdAt', 'DESC']]
        });
        if (!ratings || ratings.length === 0) {
            return res.status(400).json({ message: "There are no ratings for your product" });
        }
        return res.status(200).json({ ratings });
    }
    catch (error) {
        console.error("Error fetching ratings:", error);
        res.status(500).json({ message: error.message });
    }
});
exports.selectFeedback = selectFeedback;
const view_vendor_feedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorId = req.params.id;
        const ratings = yield rating_1.default.findAll({ include: {
                model: product_1.default,
                as: "Product"
            } });
        if (!ratings || ratings.length === 0) {
            return res;
        }
        let resFeedback = [];
        res.status(200).json({ message: "success fetched", feedback: ratings });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.view_vendor_feedback = view_vendor_feedback;
const addFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, ratingScore, feedback } = req.body;
        const productId = req.params.id;
        if (!name) {
            return res.status(402).json({ message: "You must add your name" });
        }
        if (ratingScore && ratingScore > 5) {
            return res.status(402).json({ message: "enter rating between 0 and 5" });
        }
        const saveData = yield rating_1.default.create({
            name,
            ratingScore,
            feedback,
            productId,
        });
        if (!saveData) {
            return res.status(400).json({ message: "error in saving data" });
        }
        res.status(201).json({ message: "feedback created", data: saveData });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.addFeedback = addFeedback;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewId = req.params.id;
        const review = yield review_1.default.findByPk(reviewId);
        if (!review) {
            res.status(404).json({ message: "No review Found" });
            return;
        }
        yield review.destroy();
        res.status(200).json({ message: "Review Deleted Successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteReview = deleteReview;
const sales_products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorId = req.params.id;
        const products = yield product_1.default.findAll({ where: { vendorId: vendorId } });
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        const orders = yield order_1.default.findAll();
        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }
        let product_purchase = [];
        for (const product of products) {
            for (const order of orders) {
                if (order.products.some((orderProduct) => orderProduct.productId === product.id)) {
                    product_purchase.push({ product: product, order: order });
                }
            }
        }
        return res.status(200).json({ product: product_purchase });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.sales_products = sales_products;
