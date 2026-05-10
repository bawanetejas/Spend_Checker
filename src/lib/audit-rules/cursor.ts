
import type { AuditContext, Recommendation } from '../types';
import { getPlanPrice, USD_TO_INR } from '../pricing-data';
import { calculateSavings, isOverpaying, getToolFitScore } from './common';

export function auditCursor(context: AuditContext): Recommendation[] {
    const { tool, useCase, teamSize } = context;
    const { plan, monthlySpend, seats } = tool;
    const recommendations: Recommendation[] = [];

    const expectedSpendUSD = getPlanPrice('cursor', plan) * seats;

    const expectedSpendINR = expectedSpendUSD * USD_TO_INR;

    // Rule 1: Spending verification
    if (isOverpaying(monthlySpend, expectedSpendINR)) {
        const planPrice = getPlanPrice('cursor', plan) * USD_TO_INR;
        console.log("plan pric" + planPrice)
        const savings = calculateSavings(monthlySpend, planPrice * seats);

        recommendations.push({
            action: 'downgrade',
            currentTool: 'Cursor',
            currentPlan: plan,
            currentSpend: monthlySpend,
            targetVendor: 'Cursor',
            targetPlan: plan,
            newSpend: planPrice * seats,
            monthlySavings: savings.monthly,
            annualSavings: savings.annual,
            reasoning: `Billing error: Cursor ${plan} costs $${getPlanPrice('cursor', plan)}/user (₹${planPrice.toFixed(0)}), not ₹${monthlySpend.toFixed(0)}.`,
            confidence: 'high',
        });
    }

    // Rule 2: Ultra plan 
    if (plan === 'ultra') {
        const proPrice = getPlanPrice('cursor', 'pro') * USD_TO_INR;
        const newSpend = proPrice * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        recommendations.push({
            action: 'downgrade',
            currentTool: 'Cursor',
            currentPlan: plan,
            currentSpend: monthlySpend,
            targetVendor: 'Cursor',
            targetPlan: 'Pro',
            newSpend,
            monthlySavings: savings.monthly,
            annualSavings: savings.annual,
            reasoning: `Ultra ($200/user) is for extreme power users. Pro ($20/user) handles 99% of use cases with 500 fast requests/mo.`,
            confidence: 'medium',
        });
    }

    // Rule 3: Pro+ vs Pro analysis
    if (plan === 'pro-plus' && seats <= 3) {
        const proPrice = getPlanPrice('cursor', 'pro') * USD_TO_INR;
        const newSpend = proPrice * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        if (savings.monthly > 3000) {
            recommendations.push({
                action: 'downgrade',
                currentTool: 'Cursor',
                currentPlan: plan,
                currentSpend: monthlySpend,
                targetVendor: 'Cursor',
                targetPlan: 'Pro',
                newSpend,
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                reasoning: `Pro+ ($60/user) vs Pro ($20/user): Unless you consistently hit Pro limits, downgrade saves ₹${(savings.monthly / seats).toFixed(0)}/user/mo.`,
                confidence: 'medium',
            });
        }
    }

    // Rule 4: Teams plan for small groups
    if (plan === 'teams' && seats <= 2) {
        const proPrice = getPlanPrice('cursor', 'pro') * USD_TO_INR;
        const newSpend = proPrice * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        recommendations.push({
            action: 'downgrade',
            currentTool: 'Cursor',
            currentPlan: plan,
            currentSpend: monthlySpend,
            targetVendor: 'Cursor',
            targetPlan: 'Pro',
            newSpend,
            monthlySavings: savings.monthly,
            annualSavings: savings.annual,
            reasoning: `Teams ($40/user) adds admin controls. For ${seats} user(s), Pro ($20/user) provides same AI capabilities.`,
            confidence: 'high',
        });
    }

    // Rule 5: Alternative for non-coding use cases
    if (useCase !== 'coding' && useCase !== 'mixed') {
        const chatgptPlusPrice = getPlanPrice('chatgpt', 'plus');
        const newSpend = chatgptPlusPrice * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        if (savings.monthly > 100) {
            recommendations.push({
                action: 'switch',
                currentTool: 'Cursor',
                currentPlan: plan,
                currentSpend: monthlySpend,
                targetVendor: 'ChatGPT',
                targetPlan: 'Plus',
                newSpend,
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                reasoning: `Cursor is IDE-focused. For ${useCase} workflows, ChatGPT Plus (₹1,999/user) is more cost-effective.`,
                confidence: 'high',
            });
        }
    }

    // Rule 6: Credex opportunity
    if (monthlySpend > 15000 && (plan === 'pro-plus' || plan === 'ultra' || plan === 'teams')) {
        const credexDiscount = 0.22;
        const newSpend = monthlySpend * (1 - credexDiscount);
        const savings = calculateSavings(monthlySpend, newSpend);

        if (savings.monthly >= 41650) {
            recommendations.push({
                action: 'credits',
                currentTool: 'Cursor',
                currentPlan: plan,
                currentSpend: monthlySpend,
                targetVendor: 'Credex',
                targetPlan: `${plan} (via credits)`,
                newSpend,
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                reasoning: `Credex sources Cursor credits at ~22% discount. Identical access, ₹${savings.annual.toFixed(0)}/year savings.`,
                confidence: 'high',
            });
        }
    }

    return recommendations;
}