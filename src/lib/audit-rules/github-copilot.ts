
import type { AuditContext, Recommendation } from '../types';
import { getPlanPrice, USD_TO_INR } from '../pricing-data';
import { calculateSavings, isOverpaying } from './common';

export function auditGitHubCopilot(context: AuditContext): Recommendation[] {
    const { tool, useCase, teamSize } = context;
    const { plan, monthlySpend, seats } = tool;
    const recommendations: Recommendation[] = [];

    const expectedSpendUSD = getPlanPrice('github-copilot', plan) * seats;
    const expectedSpendINR = expectedSpendUSD * USD_TO_INR;

    // Rule 1: Spending verification
    if (isOverpaying(monthlySpend, expectedSpendINR)) {
        const planPrice = getPlanPrice('github-copilot', plan) * USD_TO_INR;
        const savings = calculateSavings(monthlySpend, planPrice * seats);

        recommendations.push({
            action: 'downgrade',
            currentTool: 'GitHub Copilot',
            currentPlan: plan,
            currentSpend: monthlySpend,
            targetVendor: 'GitHub Copilot',
            targetPlan: plan,
            newSpend: planPrice * seats,
            monthlySavings: savings.monthly,
            annualSavings: savings.annual,
            reasoning: `Price mismatch: ${plan} is $${getPlanPrice('github-copilot', plan)}/user, not ₹${(monthlySpend / seats).toFixed(0)}/user.`,
            confidence: 'high',
        });
    }

    // Rule 2: Pro+ for individuals
    if (plan === 'pro-plus' && seats === 1) {
        const proPrice = getPlanPrice('github-copilot', 'pro') * USD_TO_INR;
        const newSpend = proPrice * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        recommendations.push({
            action: 'downgrade',
            currentTool: 'GitHub Copilot',
            currentPlan: plan,
            currentSpend: monthlySpend,
            targetVendor: 'GitHub Copilot',
            targetPlan: 'Pro',
            newSpend,
            monthlySavings: savings.monthly,
            annualSavings: savings.annual,
            reasoning: `Pro+ ($39) vs Pro ($10): For single user, Pro provides core autocomplete. Pro+ adds multi-file context rarely needed solo.`,
            confidence: 'medium',
        });
    }

    // Rule 3: Enterprise for small teams
    if (plan === 'enterprise' && seats < 10) {
        const businessPrice = getPlanPrice('github-copilot', 'business') * USD_TO_INR;
        const newSpend = businessPrice * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        if (savings.monthly > 1500) {
            recommendations.push({
                action: 'downgrade',
                currentTool: 'GitHub Copilot',
                currentPlan: plan,
                currentSpend: monthlySpend,
                targetVendor: 'GitHub Copilot',
                targetPlan: 'Business',
                newSpend,
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                reasoning: `Enterprise ($39/user) adds SSO, IP indemnity. For ${seats} users, Business ($19/user) covers core needs.`,
                confidence: 'high',
            });
        }
    }

    // Rule 4: Business vs Pro for small teams
    if (plan === 'business' && seats <= 3) {
        const proPrice = getPlanPrice('github-copilot', 'pro') * USD_TO_INR;
        const newSpend = proPrice * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        if (savings.monthly > 750) {
            recommendations.push({
                action: 'downgrade',
                currentTool: 'GitHub Copilot',
                currentPlan: plan,
                currentSpend: monthlySpend,
                targetVendor: 'GitHub Copilot',
                targetPlan: 'Pro',
                newSpend,
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                reasoning: `Business adds org management. For ${seats} users, individual Pro accounts ($10/user) save ₹${(savings.monthly / seats).toFixed(0)}/user/mo.`,
                confidence: 'medium',
            });
        }
    }

    // Rule 5: Alternative for non-coding workflows
    if (useCase !== 'coding' && useCase !== 'mixed') {
        const geminiPlusPrice = getPlanPrice('gemini', 'pro');
        const newSpend = geminiPlusPrice * seats;
        const savings = calculateSavings(monthlySpend, newSpend);

        if (savings.monthly > 500) {
            recommendations.push({
                action: 'switch',
                currentTool: 'GitHub Copilot',
                currentPlan: plan,
                currentSpend: monthlySpend,
                targetVendor: 'Gemini',
                targetPlan: 'Pro',
                newSpend,
                monthlySavings: savings.monthly,
                annualSavings: savings.annual,
                reasoning: `Copilot is code-centric. For ${useCase}, Gemini AI Pro (1950/user) handles general tasks at lower cost.`,
                confidence: 'high',
            });
        }
    }


    return recommendations;
}