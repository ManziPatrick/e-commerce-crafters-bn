"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const router = (0, express_1.Router)();
router.post("/toWishlist", wishlist_controller_1.addToWishlist);
router.get("/toWishlist/:userId", wishlist_controller_1.fetchWishlist);
router.delete('/toWishlist', wishlist_controller_1.removeFromWishlist);
exports.default = router;
