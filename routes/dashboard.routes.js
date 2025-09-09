import express from "express";
import { getDashboardAnalytics, getMonthlyData } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/analytics", getDashboardAnalytics);
router.get("/monthly-data", getMonthlyData);

export default router;