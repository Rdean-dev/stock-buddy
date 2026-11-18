import type {Request, Response, NextFunction} from "express";
import { z } from "zod";
import { priceActionService } from "../services/price-action.service.js";

const symbolSchema = z.string().trim().min(1);



export const getPriceActionSummary = (
    req: Request<{symbol: string}>,
    res: Response,
    
) => {
    const result = symbolSchema.safeParse(req.params.symbol);

    if(!result.success) {
        return res.status(400).json({
            error: {
                code: "INVALID_INPUT",
                message: "Invalid Input",
            },
        });
        
    }

    const summary = priceActionService.getSummary(result.data);

    return res.status(200).json({
        data: summary,
    });
};