import winston from "winston";

const isDev = process.env.NODE_ENV !== "production";

export const logger = winston.createLogger({
    level: isDev ? "debug" : "info",
    // logger.ts
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const formattedMsg =
                typeof message === "object"
                    ? JSON.stringify(message, null, 2)
                    : message;
            const metaString = Object.keys(meta).length
                ? ` ${JSON.stringify(meta)}`
                : "";
            return `${timestamp} [${level}]: ${formattedMsg}${metaString}`;
        })
    ),
    transports: [new winston.transports.Console()],
    handleExceptions: true,
    handleRejections: true,
});
