import { Router } from "express";
import { getAnalystRecommendations} from "../controllers/stock-summary.controller.js";

const router = Router();


router.get("/:symbol", getAnalystRecommendations);


export default router;