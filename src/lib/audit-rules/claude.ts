// lib/audit-rules/claude.ts
import type { AuditContext, Recommendation } from '../types';
import { getPlanPrice, USD_TO_INR } from '../pricing-data';
import { calculateSavings, isOverpaying } from './common';

export function auditClaude(context: AuditContext): Recommendation[] {
    const { tool, useCase, } = context;
    const { plan, monthlySpend, seats } = tool;
    const recommendations: Recommendation[] = [];

    const expectedSpendUSD = getPlanPrice('claude', plan) * seats;
    const expectedSpendINR = expectedSpendUSD * USD_TO_INR;

    // Rule 1: Spending verification
    if (isOverpaying(monthlySpend, expectedSpendINR)) {
        const planPrice = getPlanPrice('claude', plan) * USD_TO_INR;
        const savings = calculateSavings(monthlySpend, planPrice * seats);

        recommendations.push({
            action: 'downgrade',
            currentTool: 'Claude',
            currentPlan: plan,
            currentSpend: monthlySpend,
            targetVendor: 'Claude',
            targetPlan: plan,
            newSpend: planPrice * seats,
            monthlySavings: savings.monthly,
            annualSavings: savings.annual,
            reasoning: `Billing mismatch: ${plan} should cost ₹${(planPrice * seats).toFixed(0)}/mo for ${seats} users.`,
            confidence: 'high',
        });
    }

    // Rule 2: Team Standard for 1-2 users
    if ((plan === 'team-standard' || plan === 'team-premium') && seats <= 2) {
        const proPrice = getPlanPrice('claude', 'pro') * USD_TO_INR;
        const newSpend = proPrice * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        if (savings.monthly > 400) {
            recommendations.push({
                action: 'downgrade',
                currentTool: 'Claude',
                currentPlan: plan,
                currentSpend: monthlySpend,
                targetVendor: 'Claude',
                targetPlan: 'Pro',
                newSpend,
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                reasoning: `Team plans require 2+ users for collaboration features. For ${seats} user(s), Pro (₹${proPrice.toFixed(0)}/user) is sufficient.`,
                confidence: 'high',
            });
        }
    }

    // Rule 3: Max vs Team Premium analysis
    if (plan === 'max' && seats >= 2) {
        const teamStdPrice = getPlanPrice('claude', 'team-standard') * USD_TO_INR;
        const newSpend = teamStdPrice * seats;
        const currentPerSeat = monthlySpend / seats;

        if (currentPerSeat > teamStdPrice) {
            const savings = calculateSavings(monthlySpend, newSpend);

            recommendations.push({
                action: 'downgrade',
                currentTool: 'Claude',
                currentPlan: plan,
                currentSpend: monthlySpend,
                targetVendor: 'Claude',
                targetPlan: 'Team Standard',
                newSpend,
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                reasoning: `Multiple Max subscriptions (₹${(getPlanPrice('claude', 'max') * USD_TO_INR).toFixed(0)}/user) cost more than Team Standard (₹${teamStdPrice.toFixed(0)}/user) with better collaboration.`,
                confidence: 'high',
            });
        }
    }

    // Rule 4: Alternative for coding teams
    if (useCase === 'coding' && seats >= 2) {
        const copilotPrice = getPlanPrice('github-copilot', 'business') * USD_TO_INR;
        const newSpend = copilotPrice * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        if (savings.monthly > 2000) {
            recommendations.push({
                action: 'switch',
                currentTool: 'Claude',
                currentPlan: plan,
                currentSpend: monthlySpend,
                targetVendor: 'GitHub Copilot',
                targetPlan: 'Business',
                newSpend,
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                reasoning: `For code-first workflows, GitHub Copilot Business (₹${copilotPrice.toFixed(0)}/user) integrates directly in IDE vs separate Claude interface.`,
                confidence: 'medium',
            });
        }
    }

    // Rule 5: Credex credits opportunity
    if (monthlySpend > 8000 && (plan === 'team-standard' || plan === 'team-premium' || plan === 'max')) {
        const credexDiscount = 0.20;
        const newSpend = monthlySpend * (1 - credexDiscount);
        const savings = calculateSavings(monthlySpend, newSpend);

        recommendations.push({
            action: 'credits',
            currentTool: 'Claude',
            currentPlan: plan,
            currentSpend: monthlySpend,
            targetVendor: 'Credex',
            targetPlan: `${plan} (via credits)`,
            newSpend,
            monthlySavings: savings.monthly,
            annualSavings: savings.annual,
            reasoning: `Credex offers Claude ${plan} credits at ~20% discount. Same features, ₹${savings.monthly.toFixed(0)}/mo savings.`,
            confidence: 'high',
        });
    }

    return recommendations;
}