import { Router } from "express";
import { getPriceActionSummary} from "../controllers/price-action.controller.js";

const router = Router();


router.get("/:symbol", getPriceActionSummary);

export default router;