
import { PRICING_DATABASE, normalizeToINR } from '../lib/pricing-data';
import type { Vendor } from '../lib/types';

export interface PlanOption {
    key: string;
    label: string;
    price: number;
    currency: 'USD' | 'INR';
}

export function getPlansForVendor(vendor: Vendor): PlanOption[] {
    const vendorData = PRICING_DATABASE[vendor];
    if (!vendorData) return [];

    return Object.entries(vendorData.plans).map(([key, plan]) => {
        const priceInINR = normalizeToINR(plan.pricePerUser, plan.currency);
        const priceDisplay = plan.pricePerUser === 0
            ? 'Free'
            : plan.currency === 'USD'
                ? `$${plan.pricePerUser}/mo`
                : `₹${plan.pricePerUser}/mo`;

        return {
            key,
            label: `${plan.name} ${plan.pricePerUser > 0 ? `(${priceDisplay})` : ''}`,
            price: priceInINR,
            currency: plan.currency,
        };
    });
}