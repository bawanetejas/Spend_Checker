
import { supabase } from './supabase';
import type { AuditResult, LeadInput } from './types';
import { checkRateLimit } from "./rate-limit"
export class APIError extends Error {
    code?: string;

    constructor(message: string, code?: string) {
        super(message);

        this.name = 'APIError';
        this.code = code;
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
            ai_summary: result.ai_summary || null,
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
        ai_summary: data.ai_summary || undefined,
        createdAt: data.created_at,
    };
}


// capture lead

export async function saveLead(
    lead: LeadInput,
    auditData: { totalMonthlySavings: number; totalAnnualSavings: number }
): Promise<void> {
    // Rate limit check
    const rateLimitResult = await checkRateLimit(lead.email);
    if (!rateLimitResult.allowed) {
        throw new APIError('Too many submissions. Please try again in an hour.', 'RATE_LIMIT_EXCEEDED');
    }

    // Save to database
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
        if (error.code === '23505') {
            throw new APIError('Email already submitted for this audit', error.code);
        }
        throw new APIError('Failed to save lead', error.code);
    }

    // Send confirmation email (don't await - fire and forget smooth working)
    const auditUrl = `${window.location.origin}?audit=${lead.auditId}`;

    await fetch("/api/send-email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: lead.email,
            companyName: lead.companyName,
            auditId: lead.auditId,
            totalMonthlySavings: auditData.totalMonthlySavings,
            totalAnnualSavings: auditData.totalAnnualSavings,
            auditUrl,
        }),
    });

}


// check lead already stored 
export async function hasSubmittedLead(auditId: string, email: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('leads')
        .select('id')
        .eq('audit_id', auditId)
        .eq('email', email)
        .maybeSingle();


    if (error) {
        console.error('Error checking lead:', error);
        return false;
    }


    return data !== null;
}
