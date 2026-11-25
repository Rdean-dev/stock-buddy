import type {Request, Response, NextFunction} from "express";
import { z } from "zod";
import { getSummary } from "../services/price-action.service.js";
import { getRecentNewsSummaryService } from "../services/recent-news.service.js";

const symbolSchema = z.string().trim().min(1);



export async function getPriceActionSummary ( req: Request, res: Response, next: NextFunction){
    try{
        const result = symbolSchema.safeParse(req.params.symbol);

        if(!result.success) {
            return res.status(400).json({
                error: {
                    code: "INVALID_INPUT",
                    message: "Invalid Input",
                },
            });
            
        }

        const summary = await getSummary(result.data);

        return res.status(200).json({
            data: summary,
        });
    } catch (error) {
        next(error)
    }
};
export async function getRecentNewsSummary (req: Request, res: Response, next: NextFunction){
    try {
        const result = symbolSchema.safeParse(req.params.symbol);

        if(!result.success) {
            return res.status(400).json({
                error: {
                    code: "INVALID_INPUT",
                    message: "Invalid Input",
                },
            });
        }

        const summary = await getRecentNewsSummaryService(result.data);
        
        return res.status(200).json({
            data: summary,
        });
    } catch (error) {
        next(error);
    }
}
