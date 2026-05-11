
import { supabase } from './supabase';
import type { AuditResult, LeadInput } from './types';

export class APIError extends Error {
    constructor(message: string, code?: string) {
        super(message);
        this.name = 'APIError';
    }
}


//  Save audit result to Supabase

export async function saveAuditResult(result: AuditResult): Promise<string> {
    const { data, error } = await supabase
        .from('audit_results')
        .insert({
            id: result.id,
            tools: result.tools,
            recommendations: result.recommendations,
            total_monthly_savings: result.totalMonthlySavings,
            total_annual_savings: result.totalAnnualSavings,
            use_case: result.useCase,
            team_size: result.teamSize,
            ai_summary: result.aiSummary || null,
            is_public: true,
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error saving audit:', error);
        throw new APIError('Failed to save audit result', error.code);
    }

    return data.id;
}
