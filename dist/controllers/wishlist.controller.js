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
exports.removeFromWishlist = exports.addToWishlist = exports.fetchWishlist = void 0;
const wishlist_1 = __importDefault(require("../database/models/wishlist"));
const wishlistItem_1 = __importDefault(require("../database/models/wishlistItem"));
const user_1 = __importDefault(require("../database/models/user"));
const fetchWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const wishlist = yield wishlist_1.default.findOne({ where: { userId } });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }
        const wishlistItems = yield wishlistItem_1.default.findAll({
            where: { wishlistId: wishlist.wishlistId },
        });
        return res.status(200).json({ wishlist: wishlistItems });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.fetchWishlist = fetchWishlist;
const addToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId, price } = req.body;
        let wishlist = yield wishlist_1.default.findOne({ where: { userId } });
        if (!wishlist) {
            wishlist = yield wishlist_1.default.create({ userId });
            yield user_1.default.update({ wishlistId: wishlist.wishlistId }, { where: { userId } });
            const wishlistItem = yield wishlistItem_1.default.create({
                wishlistId: wishlist.wishlistId,
                productId,
            });
            if (wishlistItem) {
                return res
                    .status(200)
                    .json({ message: "Wishlist added successfully!", wishlist: wishlistItem });
            }
        }
        else {
            const existedProduct = yield wishlistItem_1.default.findOne({
                where: {
                    wishlistId: wishlist.wishlistId,
                    productId,
                },
            });
            if (existedProduct) {
                return res.status(409).json({ message: "Product already exists in wishlist" });
            }
            const wishlistItem = yield wishlistItem_1.default.create({
                wishlistId: wishlist.wishlistId,
                productId,
                price,
            });
            if (wishlistItem) {
                return res
                    .status(200)
                    .json({ message: "Wishlist item added successfully!", wishlist: wishlistItem });
            }
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.addToWishlist = addToWishlist;
const removeFromWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.body;
        const wishlist = yield wishlist_1.default.findOne({ where: { userId } });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }
        const wishlistItem = yield wishlistItem_1.default.findOne({
            where: {
                wishlistId: wishlist.wishlistId,
                productId,
            },
        });
        if (!wishlistItem) {
            return res.status(404).json({ message: "Product not found in wishlist" });
        }
        yield wishlistItem_1.default.destroy({
            where: {
                wishlistId: wishlist.wishlistId,
                productId,
            },
        });
        return res.status(200).json({ message: "Product removed from wishlist successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.removeFromWishlist = removeFromWishlist;
