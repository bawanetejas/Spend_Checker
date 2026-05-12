// lib/audit-rules/gemini.ts
import type { AuditContext, Recommendation } from '../types';
import { getPlanPrice } from '../pricing-data';
import { calculateSavings, isOverpaying } from './common';

export function auditGemini(context: AuditContext): Recommendation[] {
    const { tool, useCase, teamSize } = context;
    const { plan, monthlySpend, seats } = tool;
    const recommendations: Recommendation[] = [];

    const expectedSpend = getPlanPrice('gemini', plan) * seats;

    // Rule 1: Spending verification
    if (isOverpaying(monthlySpend, expectedSpend)) {
        const planPrice = getPlanPrice('gemini', plan);
        const savings = calculateSavings(monthlySpend, planPrice * seats);

        recommendations.push({
            action: 'downgrade',
            currentTool: 'Gemini',
            currentPlan: plan,
            currentSpend: monthlySpend,
            targetVendor: 'Gemini',
            targetPlan: plan,
            newSpend: planPrice * seats,
            monthlySavings: savings.monthly,
            annualSavings: savings.annual,
            reasoning: `Billing error: ${plan} should be ₹${planPrice}/user, not ₹${(monthlySpend / seats).toFixed(0)}/user.`,
            confidence: 'high',
        });
    }

    // Rule 2: AI Pro analysis
    if (plan === 'pro' && seats >= 3) {
        const chatgptPlusPrice = getPlanPrice('chatgpt', 'plus');
        const newSpend = chatgptPlusPrice * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        if (savings.monthly > 1000) {
            recommendations.push({
                action: 'switch',
                currentTool: 'Gemini',
                currentPlan: plan,
                currentSpend: monthlySpend,
                targetVendor: 'ChatGPT',
                targetPlan: 'Plus',
                newSpend,
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                reasoning: `Gemini AI Pro (₹1,950/user) vs ChatGPT Plus (₹1,999/user): Similar capability, but ChatGPT has stronger ecosystem for ${useCase}.`,
                confidence: 'medium',
            });
        }
    }

    // Rule 3: AI Plus vs Free for light users
    if (plan === 'ultra' && teamSize <= 2) {
        const freePrice = 0;
        const savings = calculateSavings(monthlySpend, freePrice);

        if (monthlySpend < 1000) {
            recommendations.push({
                action: 'downgrade',
                currentTool: 'Gemini',
                currentPlan: plan,
                currentSpend: monthlySpend,
                targetVendor: 'Gemini',
                targetPlan: 'Free',
                newSpend: freePrice,
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                reasoning: `For light usage (${seats} users), Gemini Free tier provides substantial capability before paying ₹399/user.`,
                confidence: 'low',
            });
        }
    }

    // Rule 4: Alternative for coding workflows
    if (useCase === 'coding' && seats >= 2) {
        const copilotBusinessPrice = getPlanPrice('github-copilot', 'business') * 83.5;
        const newSpend = copilotBusinessPrice * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        if (savings.monthly > 2000) {
            recommendations.push({
                action: 'switch',
                currentTool: 'Gemini',
                currentPlan: plan,
                currentSpend: monthlySpend,
                targetVendor: 'GitHub Copilot',
                targetPlan: 'Business',
                newSpend,
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                reasoning: `For coding teams, GitHub Copilot Business (₹${copilotBusinessPrice.toFixed(0)}/user) offers native IDE integration vs chat interface.`,
                confidence: 'medium',
            });
        }
    }

    // credex opportunity


    return recommendations;
}