import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { expressHandler } from "trpc-playground/handlers/express";
import { playgroundEndpoint, trpcApiEndpoint } from "./config/endpoint.mjs";
import { appRouter, AppRouter } from "./routers/index.mjs";
import { createContext } from "./trpc/context.mjs";
import { logger } from "./utils/logger.mjs";

console.log("⚙️  process.env snapshot:", process.env.SERVER_PORT);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    return res.status(200).json({
        hostname: req.hostname,
        message: "HELLO FROM BACKEND",
        unix: Date.now(),
        time: new Date().toISOString(),
    });
});

app.use(
    trpcApiEndpoint,
    trpcExpress.createExpressMiddleware<AppRouter>({
        router: appRouter,
        createContext,
    })
);

if (process.env.NODE_ENV === "development") {
    app.use(
        playgroundEndpoint,
        await expressHandler({
            trpcApiEndpoint,
            playgroundEndpoint,
            router: appRouter,
        })
    );
}

const port = process.env.SERVER_PORT;

app.listen(port, () => {
    logger.info(`SERVER STARTED LISTENING ON PORT: ${port}`);
});
