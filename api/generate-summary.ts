import { generateAuditSummary } from "./lib/ai.js";

export default async function handler(req: any, res: any) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed",
        });
    }

    try {

        const summary = await generateAuditSummary(
            req.body
        );

        return res.status(200).json({
            summary,
        });

    } catch (error) {

        return res.status(500).json({
            error: "Failed to generate summary",
        });
    }
}