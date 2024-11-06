"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
const roles_controller_1 = require("../controllers/roles.controller");
const verfiyToken_1 = require("../middleware/verfiyToken");
const verifyRole_1 = require("../middleware/verifyRole");
const review_controller_1 = require("../controllers/review.controller");
route.put("/approve-vendor/:userId", verfiyToken_1.VerifyAccessToken, verifyRole_1.verifyAdmin, roles_controller_1.approveVendor);
route.put("/reject-vendor/:userId", verfiyToken_1.VerifyAccessToken, verifyRole_1.verifyAdmin, roles_controller_1.rejectVendor);
route.delete("/delete-review/:id", verfiyToken_1.VerifyAccessToken, verifyRole_1.verifyAdmin, review_controller_1.deleteReview);
exports.default = route;
