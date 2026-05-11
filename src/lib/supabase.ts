
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Database {
    public: {
        Tables: {
            audit_results: {
                Row: {
                    id: string;
                    tools: any;
                    recommendations: any;
                    total_monthly_savings: number;
                    total_annual_savings: number;
                    use_case: string;
                    team_size: number;
                    ai_summary: string | null;
                    created_at: string;
                    is_public: boolean;
                };
                Insert: {
                    id: string;
                    tools: any;
                    recommendations: any;
                    total_monthly_savings: number;
                    total_annual_savings: number;
                    use_case: string;
                    team_size: number;
                    ai_summary?: string | null;
                    created_at?: string;
                    is_public?: boolean;
                };
            };
            leads: {
                Row: {
                    id: string;
                    audit_id: string;
                    email: string;
                    company_name: string | null;
                    role: string | null;
                    team_size: number | null;
                    created_at: string;
                };
                Insert: {
                    audit_id: string;
                    email: string;
                    company_name?: string | null;
                    role?: string | null;
                    team_size?: number | null;
                };
            };
        };
    };
}