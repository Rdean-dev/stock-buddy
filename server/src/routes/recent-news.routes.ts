import Router from "express";
import {getRecentNewsSummary} from "../controllers/stock-summary.controller.js"

const router = Router();

router.get("/:symbol", getRecentNewsSummary);

export default router;