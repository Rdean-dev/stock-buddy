import type {Request, Response, NextFunction} from "express";

export function notFound(
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    res.status(404).json({
        error: {
            code: "ROUTE_NOT_FOUND",
            message: "Endpoint not found",
        },
    });
}