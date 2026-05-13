
import { supabase } from './supabase';

interface RateLimitCheck {
    allowed: boolean;
    remainingAttempts: number;
}

export async function checkRateLimit(email: string): Promise<RateLimitCheck> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // Count submissions from this email in the last hour
    const { count, error } = await supabase
        .from('leads')
        .select('id', { count: 'exact', head: true })
        .eq('email', email)
        .gte('created_at', oneHourAgo);

    if (error) {
        console.error('Rate limit check error:', error);
        return { allowed: true, remainingAttempts: 3 }; // Fail open
    }

    const submissionCount = count || 0;
    const maxAttempts = 3;

    return {
        allowed: submissionCount < maxAttempts,
        remainingAttempts: Math.max(0, maxAttempts - submissionCount),
    };
}