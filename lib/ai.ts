import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
);

export async function generateAuditSummary(data: any) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
Generate a professional 100-word audit summary.

Monthly savings: ₹${data.totalMonthlySavings}
Annual savings: ₹${data.totalAnnualSavings}

Recommended tools:
${data.recommendations.join(", ")}

Instructions:
- If the monthly savings are between ₹0 and ₹1000, do NOT suggest optimization, cost-cutting, subscription changes, downgrades, or switching tools.
- In that case, simply state that the current tool stack or subscription setup is already well-optimized for the user's use case.
- Only provide optimization suggestions when the monthly savings exceed ₹1000.
- Keep the response realistic, practical, and confidence-inspiring.

Tone:
Professional, concise, actionable.

Output rules:
- Return only plain text.
- Do not use markdown.
- Do not use bullet points.
- Return a single concise paragraph.
`;

        const result = await model.generateContent(prompt);


        return result.response.text();

    } catch (error) {


        // graceful fallback
        return `
Your audit identified potential AI cost optimization opportunities.
You could save approximately ₹${data.totalMonthlySavings}
per month by optimizing subscriptions and selecting better pricing plans.
`;
    }
}