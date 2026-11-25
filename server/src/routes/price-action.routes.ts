import { Router } from "express";
import { getPriceActionSummary} from "../controllers/stock-summary.controller.js";

const router = Router();


router.get("/:symbol", getPriceActionSummary);


export default router;