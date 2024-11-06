"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analyticController_1 = require("../controllers/analyticController");
const router = express_1.default.Router();
router.get("/annualSellingReport/:id", analyticController_1.annualSellingReport);
router.get("/overallAnnualSellingReport/", analyticController_1.overallAnnualSellingReport);
router.get("/WeeklySellingReport/:id", analyticController_1.WeeklySellingReport);
router.get("/OverallWeeklySellingReport/", analyticController_1.OverallWeeklySellingReport);
exports.default = router;
