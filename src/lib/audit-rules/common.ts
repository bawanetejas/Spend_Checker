
import type { UseCase, Recommendation, ToolInput, AuditContext } from '../types';

export function calculateSavings(currentSpend: number, newSpend: number): {
    monthly: number;
    annual: number;
} {
    const monthly = Math.max(0, currentSpend - newSpend);
    return {
        monthly,
        annual: monthly * 12,
    };
}

export function isOverpaying(actualSpend: number, expectedSpend: number): boolean {
    // Strict: allow only ₹100 or 2%, whichever is SMALLER
    const maxAllowedDifference = Math.min(100, expectedSpend * 0.02);
    return actualSpend > expectedSpend + maxAllowedDifference;
}

export function isUnderpaying(actualSpend: number, expectedSpend: number): boolean {
    // Strict: allow only ₹100 or 2%, whichever is SMALLER
    const maxAllowedDifference = Math.min(100, expectedSpend * 0.02);
    return actualSpend < expectedSpend - maxAllowedDifference;
}

// Use case compatibility matrix
export const USE_CASE_COMPATIBILITY = {
    coding: {
        cursor: 5,
        'github-copilot': 5,
        claude: 3,
        chatgpt: 3,
        gemini: 2,
    },
    writing: {
        chatgpt: 5,
        claude: 5,
        gemini: 4,
        cursor: 2,
        'github-copilot': 1,
    },
    data: {
        chatgpt: 4,
        claude: 5,
        gemini: 3,
        cursor: 2,
        'github-copilot': 1,
    },
    research: {
        chatgpt: 5,
        claude: 5,
        gemini: 4,
        cursor: 2,
        'github-copilot': 1,
    },
    mixed: {
        chatgpt: 4,
        claude: 4,
        cursor: 4,
        'github-copilot': 3,
        gemini: 3,
    },
} as const;

export function getToolFitScore(vendor: string, useCase: UseCase): number {
    return USE_CASE_COMPATIBILITY[useCase][vendor as keyof typeof USE_CASE_COMPATIBILITY[typeof useCase]] || 0;
}