import express from "express";
import priceActionRoutes from "./routes/price-action.routes.js";
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
    });
});

app.use("/api/price-action-summary", priceActionRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;