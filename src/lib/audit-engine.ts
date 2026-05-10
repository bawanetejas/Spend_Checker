
import type { AuditInput, AuditResult, Recommendation } from './types';
import { auditChatGPT } from './audit-rules/chatgpt';
import { auditClaude } from './audit-rules/claude';
import { auditCursor } from './audit-rules/cursor';
import { auditGitHubCopilot } from './audit-rules/github-copilot';
import { auditGemini } from './audit-rules/gemini';
import { nanoid } from 'nanoid';

const AUDIT_FUNCTIONS = {
    chatgpt: auditChatGPT,
    claude: auditClaude,
    cursor: auditCursor,
    'github-copilot': auditGitHubCopilot,
    gemini: auditGemini,
};

export function runAudit(input: AuditInput): Omit<AuditResult, 'id' | 'createdAt' | 'aiSummary'> {
    const allRecommendations: Recommendation[] = [];

    // Run audit for each tool
    for (const tool of input.tools) {
        const auditFn = AUDIT_FUNCTIONS[tool.vendor];
        if (!auditFn) continue;

        const context = {
            tool,
            useCase: input.useCase,
            teamSize: input.teamSize,
        };

        const recommendations = auditFn(context);
        allRecommendations.push(...recommendations);
    }

    // Sort recommendations by savings (highest first)
    allRecommendations.sort((a, b) => b.monthlySavings - a.monthlySavings);

    // Calculate totals
    const totalMonthlySavings = allRecommendations.reduce(
        (sum, rec) => sum + rec.monthlySavings,
        0
    );
    const totalAnnualSavings = totalMonthlySavings * 12;

    // If no savings found, add an "optimal" recommendation
    if (allRecommendations.length === 0) {
        allRecommendations.push({
            action: 'optimal',
            currentTool: 'All Tools',
            currentPlan: 'Current Setup',
            currentSpend: input.tools.reduce((sum, t) => sum + t.monthlySpend, 0),
            monthlySavings: 0,
            annualSavings: 0,
            reasoning: `Your AI tool spending is well-optimized. You're on appropriate plans for your team size (${input.teamSize}) and use case (${input.useCase}).`,
            confidence: 'high',
        });
    }

    return {
        tools: input.tools,
        recommendations: allRecommendations,
        totalMonthlySavings,
        totalAnnualSavings,
        useCase: input.useCase,
        teamSize: input.teamSize,
    };
}

export function generateAuditId(): string {
    return nanoid(12);
}