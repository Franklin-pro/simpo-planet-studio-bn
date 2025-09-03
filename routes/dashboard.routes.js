import express from "express";
import { getDashboardAnalytics } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/analytics", getDashboardAnalytics);

export default router;