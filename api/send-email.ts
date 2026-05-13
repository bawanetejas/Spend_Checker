import {
    sendAuditConfirmationEmail,
} from "./lib/send-email-helper.js";

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed",
        });
    }

    try {
        const success = await sendAuditConfirmationEmail(req.body);

        if (!success) {
            return res.status(500).json({
                error: "Failed to send email",
            });
        }

        return res.status(200).json({
            success: true,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
}