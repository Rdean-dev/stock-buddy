import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
    err,
    _req,
    res,
    _next,
) => {
    console.error(err);

    res.status(500).json({
        error:{
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
        },
    });
};