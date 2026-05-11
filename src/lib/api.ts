
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


// Get audit result by ID

export async function getAuditResult(id: string): Promise<AuditResult | null> {
    const { data, error } = await supabase
        .from('audit_results')
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .single();


    if (error) {
        if (error.code === 'PGRST116') {
            // Not found
            return null;
        }
        console.error('Error fetching audit:', error);
        throw new APIError('Failed to fetch audit result', error.code);
    }


    // Transform database row to AuditResult
    return {
        id: data.id,
        tools: data.tools,
        recommendations: data.recommendations,
        totalMonthlySavings: Number(data.total_monthly_savings),
        totalAnnualSavings: Number(data.total_annual_savings),
        useCase: data.use_case as any,
        teamSize: data.team_size,
        aiSummary: data.ai_summary || undefined,
        createdAt: data.created_at,
    };
}


// capture lead

export async function saveLead(lead: LeadInput): Promise<void> {
    const { error } = await supabase
        .from('leads')
        .insert({
            audit_id: lead.auditId,
            email: lead.email,
            company_name: lead.companyName || null,
            role: lead.role || null,
            team_size: lead.teamSize || null,
        });


    if (error) {
        // Check for duplicate
        if (error.code === '23505') {
            throw new APIError('Email already submitted for this audit', error.code);
        }
        console.error('Error saving lead:', error);
        throw new APIError('Failed to save lead', error.code);
    }
}
