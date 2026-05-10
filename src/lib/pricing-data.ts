
export interface PlanPricing {
    name: string;
    pricePerUser: number;
    currency: 'USD' | 'INR';
    minSeats?: number;
    maxSeats?: number;
    features?: string[];
    Custom?: boolean;
}

export interface VendorPricing {
    vendor: string;
    plans: Record<string, PlanPricing>;
    url: string;
    verifiedDate: string;
}

export const PRICING_DATABASE: Record<string, VendorPricing> = {
    chatgpt: {
        vendor: 'ChatGPT',
        url: 'https://openai.com/chatgpt/pricing',
        verifiedDate: '2026-05-08',
        plans: {
            // free: { name: 'Free', pricePerUser: 0, currency: 'INR' },
            // go: { name: 'Go', pricePerUser: 399, currency: 'INR' },
            plus: { name: 'Plus', pricePerUser: 1999, currency: 'INR' },
            pro: { name: 'Pro', pricePerUser: 10699, currency: 'INR' },
            // 'business-codex': { name: 'Business Codex', pricePerUser: 0, currency: 'INR', Custom: true }, // Usage-based
            'business-full': { name: 'Business ChatGPT & Codex', pricePerUser: 1800, currency: 'INR' },
            enterprise: { name: 'Enterprise', pricePerUser: 0, currency: 'INR', Custom: true }, // Custom
        },
    },
    claude: {
        vendor: 'Claude',
        url: 'https://claude.com/pricing',
        verifiedDate: '2026-05-08',
        plans: {
            free: { name: 'Free', pricePerUser: 0, currency: 'USD' },
            pro: { name: 'Pro', pricePerUser: 20, currency: 'USD' },
            max: { name: 'Max', pricePerUser: 100, currency: 'USD' },
            'team-standard': { name: 'Team Standard', pricePerUser: 25, currency: 'USD', minSeats: 2 },
            'team-premium': { name: 'Team Premium', pricePerUser: 100, currency: 'USD', minSeats: 2 },
            enterprise: { name: 'Enterprise', pricePerUser: 0, currency: 'USD', Custom: true }, // Custom
        },
    },
    cursor: {
        vendor: 'Cursor',
        url: 'https://cursor.sh/pricing',
        verifiedDate: '2026-05-08',
        plans: {
            hobby: { name: 'Hobby', pricePerUser: 0, currency: 'USD' },
            pro: { name: 'Pro', pricePerUser: 20, currency: 'USD' },
            'pro-plus': { name: 'Pro+', pricePerUser: 60, currency: 'USD' },
            ultra: { name: 'Ultra', pricePerUser: 200, currency: 'USD' },
            teams: { name: 'Teams', pricePerUser: 40, currency: 'USD', minSeats: 2 },
            enterprise: { name: 'Enterprise', pricePerUser: 0, currency: 'USD', Custom: true }, // Custom
        },
    },
    'github-copilot': {
        vendor: 'GitHub Copilot',
        url: 'https://github.com/features/copilot/plans',
        verifiedDate: '2026-05-08',
        plans: {

            pro: { name: 'Pro', pricePerUser: 10, currency: 'USD' },
            'pro-plus': { name: 'Pro+', pricePerUser: 39, currency: 'USD' },
            business: { name: 'Business', pricePerUser: 19, currency: 'USD', minSeats: 2 },
            enterprise: { name: 'Enterprise', pricePerUser: 39, currency: 'USD', minSeats: 10 },
        },
    },
    gemini: {
        vendor: 'Gemini',
        url: 'https://one.google.com/about/ai-premium/',
        verifiedDate: '2026-05-08',
        plans: {

            // 'plus': { name: 'Google AI Plus', pricePerUser: 399, currency: 'INR' },
            'pro': { name: 'Google AI Pro', pricePerUser: 1950, currency: 'INR' },
            'ultra': { name: 'Google AI Ultra', pricePerUser: 24500, currency: 'INR' }, // Custom
        },
    },
};

// Exchange rate (approximate, should be updated regularly)
export const USD_TO_INR = 83.5;

export function normalizeToINR(amount: number, currency: 'USD' | 'INR'): number {
    return currency === 'USD' ? amount * USD_TO_INR : amount;
}

export function getPlanPrice(vendor: string, planKey: string): number {
    const vendorData = PRICING_DATABASE[vendor];
    if (!vendorData) return 0;

    const plan = vendorData.plans[planKey];
    if (!plan) return 0;

    // return normalizeToINR(plan.pricePerUser, plan.currency);
    return plan.pricePerUser
}