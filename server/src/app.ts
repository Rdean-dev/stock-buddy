import express from "express";
import priceActionRoutes from "./routes/price-action.routes.js";
import recentNewsRoutes from "./routes/recent-news.routes.js"
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";
import cors from "cors";


const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:8081",
}));

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
    });
});

app.use("/api/price-action-summary", priceActionRoutes);
app.use("/api/recent-news-summary", recentNewsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;