
export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export type Vendor = 'chatgpt' | 'claude' | 'cursor' | 'github-copilot' | 'gemini';

export interface ToolInput {
    vendor: Vendor;
    plan: string;
    monthlySpend: number;
    seats: number;
}

export interface AuditInput {
    tools: ToolInput[];
    useCase: UseCase;
    teamSize: number;
}

export interface Recommendation {
    action: 'downgrade' | 'switch' | 'optimal' | 'credits' | 'upgrade';
    currentTool: string;
    currentPlan: string;
    currentSpend: number;
    targetVendor?: string;
    targetPlan?: string;
    newSpend?: number;
    monthlySavings: number;
    annualSavings: number;
    reasoning: string;
    confidence: 'high' | 'medium' | 'low';
}

export interface AuditResult {
    id: string;
    tools: ToolInput[];
    recommendations: Recommendation[];
    totalMonthlySavings: number;
    totalAnnualSavings: number;
    useCase: UseCase;
    teamSize: number;
    ai_summary?: string;
    createdAt: string;
}

export interface LeadInput {
    auditId: string;
    email: string;
    companyName?: string;
    role?: string;
    teamSize?: number;
}

export interface AuditContext {
    tool: ToolInput;
    useCase: UseCase;
    teamSize: number;
}