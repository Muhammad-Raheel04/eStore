import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

const generateSessionId = () => randomBytes(16).toString("hex");

export const identifyCart = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let userId = null;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                userId = decoded?.id;
            } catch {
                // ignore token errors for guest flow
            }
        }

        if (userId) {
            req.userId = userId;
            req.cartQuery = { userId };
            return next();
        }

        let sessionId = req.cookies?.sessionId;
        if (!sessionId) {
            sessionId = generateSessionId();
            const isProd = process.env.NODE_ENV === "production";
            res.cookie("sessionId", sessionId, {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? "none" : "lax",
                maxAge: 1000 * 60 * 60 * 24 * 90 // 90 days
            });
        }
        req.sessionId = sessionId;
        req.cartQuery = { sessionId };
        return next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to identify cart",
        });
    }
};

