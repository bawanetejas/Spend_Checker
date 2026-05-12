
import type { AuditContext, Recommendation } from '../types';
import { getPlanPrice } from '../pricing-data';
import { calculateSavings, isOverpaying, getToolFitScore } from './common';

export function auditChatGPT(context: AuditContext): Recommendation[] {
    const { tool, useCase } = context;
    const { plan, monthlySpend, seats } = tool;
    const recommendations: Recommendation[] = [];

    const expectedSpend = getPlanPrice('chatgpt', plan) * seats;
    // const costPerSeat = monthlySpend / seats;

    // Rule 1: Spending verification
    if (isOverpaying(monthlySpend, expectedSpend)) {
        const planPrice = getPlanPrice('chatgpt', plan);

        const savings = calculateSavings(monthlySpend, planPrice * seats);

        recommendations.push({
            action: 'downgrade',
            currentTool: 'ChatGPT',
            currentPlan: plan,
            currentSpend: monthlySpend,
            targetVendor: 'ChatGPT',
            targetPlan: plan,
            newSpend: planPrice * seats,
            monthlySavings: savings.monthly,
            annualSavings: savings.annual,
            reasoning: `You're paying ₹${(monthlySpend / seats).toFixed(0)}/mo/user but ${plan} costs ₹${planPrice}/user. Correct billing or check for extra charges.`,
            confidence: 'high',
        });
    }

    // Rule 2: Team plan optimization for small teams
    if (plan === 'business-full' && seats <= 5) {
        const plusPrice = getPlanPrice('chatgpt', 'plus');
        const newSpend = plusPrice * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        if (savings.monthly > 500) {
            recommendations.push({
                action: 'downgrade',
                currentTool: 'ChatGPT',
                currentPlan: plan,
                currentSpend: monthlySpend,
                targetVendor: 'ChatGPT',
                targetPlan: 'Plus',
                newSpend,
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                reasoning: `Business plan for ${seats} users is overkill. Plus provides core features at ₹${plusPrice}/user vs ₹1,800/user.`,
                confidence: 'high',
            });
        }
    }

    // Rule 3: Pro plan analysis (high-end individual)
    if (plan === 'pro' && seats > 3) {
        const plusPrice = getPlanPrice('chatgpt', 'plus');
        const newSpend = plusPrice * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        recommendations.push({
            action: 'downgrade',
            currentTool: 'ChatGPT',
            currentPlan: plan,
            currentSpend: monthlySpend,
            targetVendor: 'ChatGPT',
            targetPlan: 'Plus',
            newSpend,
            monthlySavings: savings.monthly,
            annualSavings: savings.annual,
            reasoning: `Pro (₹10,699/user) is for power users needing unlimited o1. Most teams get 95% value from Plus (₹1,999/user).`,
            confidence: 'medium',
        });
    }

    // Rule 4: Alternative for coding-focused teams
    if (useCase === 'coding' && seats >= 3) {
        const cursorProPrice = getPlanPrice('cursor', 'pro');
        const newSpend = cursorProPrice * USD_TO_INR * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        if (savings.monthly > 10000 && getToolFitScore('cursor', useCase) > getToolFitScore('chatgpt', useCase)) {
            recommendations.push({
                action: 'switch',
                currentTool: 'ChatGPT',
                currentPlan: plan,
                currentSpend: monthlySpend,
                targetVendor: 'Cursor',
                targetPlan: 'Pro',
                newSpend,
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                reasoning: `For coding-primary teams, Cursor Pro (₹${(cursorProPrice * USD_TO_INR).toFixed(0)}/user) offers better IDE integration than ChatGPT.`,
                confidence: 'medium',
            });
        }
    }

    // Rule 5: Credex opportunity for high spend
    if (monthlySpend > 10000) {
        const credexDiscount = 0.18; // 18% discount assumption
        const newSpend = monthlySpend * (1 - credexDiscount);
        const savings = calculateSavings(monthlySpend, newSpend);

        recommendations.push({
            action: 'credits',
            currentTool: 'ChatGPT',
            currentPlan: plan,
            currentSpend: monthlySpend,
            targetVendor: 'Credex',
            targetPlan: `${plan} (via credits)`,
            newSpend,
            monthlySavings: savings.monthly,
            annualSavings: savings.annual,
            reasoning: `Purchase ChatGPT credits through Credex at ~18% discount. Same access, lower cost.`,
            confidence: 'high',
        });
    }

    return recommendations;
}

const USD_TO_INR = 83.5;