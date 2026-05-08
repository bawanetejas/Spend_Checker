const vendors = [
    {
        vendor_id: "chatgpt",
        vendor_name: "ChatGPT",

        plans: [
            {
                plan_id: "chatgpt_free",
                plan_name: "Free",

                pricing: {
                    amount: 0,
                    currency: "INR",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1
                },

                features: {
                    chat_access: true,
                    coding_tools: false,
                    api_access: false,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false
                }
            },

            {
                plan_id: "chatgpt_go",
                plan_name: "Go",

                pricing: {
                    amount: 399,
                    currency: "INR",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1
                },

                features: {
                    chat_access: true,
                    coding_tools: false,
                    api_access: false,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false
                }
            },

            {
                plan_id: "chatgpt_plus",
                plan_name: "Plus",

                pricing: {
                    amount: 1999,
                    currency: "INR",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1
                },

                features: {
                    chat_access: true,
                    coding_tools: true,
                    api_access: false,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false
                }
            },

            {
                plan_id: "chatgpt_pro",
                plan_name: "Pro",

                pricing: {
                    amount: 10699,
                    currency: "INR",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1
                },

                features: {
                    chat_access: true,
                    coding_tools: true,
                    api_access: true,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false
                }
            },

            {
                plan_id: "chatgpt_business_codex",
                plan_name: "Business Codex",

                pricing: {
                    amount: null,
                    currency: "INR",
                    billing_cycle: "monthly",
                    pricing_model: "usage_based",
                    is_custom_pricing: false,
                    is_usage_based: true
                },

                user_rules: {
                    min_users: null,
                    max_users: null
                },

                features: {
                    chat_access: false,
                    coding_tools: true,
                    api_access: true,
                    team_workspace: true,
                    enterprise_support: false,
                    sso: false
                }
            },

            {
                plan_id: "chatgpt_business_chatgpt_codex",
                plan_name: "Business ChatGPT & Codex",

                pricing: {
                    amount: 1800,
                    currency: "INR",
                    billing_cycle: "monthly",
                    pricing_model: "per_user",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 2,
                    max_users: null
                },

                features: {
                    chat_access: true,
                    coding_tools: true,
                    api_access: true,
                    team_workspace: true,
                    enterprise_support: false,
                    sso: false
                }
            },

            {
                plan_id: "chatgpt_enterprise",
                plan_name: "Enterprise",

                pricing: {
                    amount: null,
                    currency: "INR",
                    billing_cycle: "monthly",
                    pricing_model: "custom",
                    is_custom_pricing: true,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: null,
                    max_users: null
                },

                features: {
                    chat_access: true,
                    coding_tools: true,
                    api_access: true,
                    team_workspace: true,
                    enterprise_support: true,
                    sso: true
                }
            }
        ]
    },

    {
        vendor_id: "claude",
        vendor_name: "Claude",

        plans: [
            {
                plan_id: "claude_free",
                plan_name: "Free",

                pricing: {
                    amount: 0,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1
                },

                features: {
                    chat_access: true,
                    coding_tools: false,
                    api_access: false,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false
                }
            },

            {
                plan_id: "claude_pro",
                plan_name: "Pro",

                pricing: {
                    amount: 20,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1
                },

                features: {
                    chat_access: true,
                    coding_tools: true,
                    api_access: false,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false
                }
            },

            {
                plan_id: "claude_max",
                plan_name: "Max",

                pricing: {
                    amount: 100,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1
                },

                features: {
                    chat_access: true,
                    coding_tools: true,
                    api_access: true,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false
                }
            },

            {
                plan_id: "claude_team_standard",
                plan_name: "Team Standard",

                pricing: {
                    amount: 25,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "per_user",
                    is_custom_pricing: false,
                    is_usage_based: false,

                    billed_annually: true
                },

                user_rules: {
                    min_users: 5,
                    max_users: null
                },

                features: {
                    chat_access: true,
                    coding_tools: true,
                    api_access: false,
                    team_workspace: true,
                    enterprise_support: false,
                    sso: false
                }
            },

            {
                plan_id: "claude_team_premium",
                plan_name: "Team Premium",

                pricing: {
                    amount: 100,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "per_user",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: null
                },

                features: {
                    chat_access: true,
                    coding_tools: true,
                    api_access: true,
                    team_workspace: true,
                    enterprise_support: true,
                    sso: true
                },

                metadata: {
                    target_audience: "Technical/Dev Teams"
                }
            },

            {
                plan_id: "claude_enterprise",
                plan_name: "Enterprise",

                pricing: {
                    amount: 20,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "custom_plus_usage",
                    is_custom_pricing: true,
                    is_usage_based: true
                },

                user_rules: {
                    min_users: 5,
                    max_users: null
                },

                features: {
                    chat_access: true,
                    coding_tools: true,
                    api_access: true,
                    team_workspace: true,
                    enterprise_support: true,
                    sso: true
                }
            }
        ]
    },

    {
        vendor_id: "cursor",
        vendor_name: "Cursor",

        plans: [
            {
                plan_id: "cursor_hobby",
                plan_name: "Hobby",

                pricing: {
                    amount: 0,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1
                },

                features: {
                    ai_coding: true,
                    chat_access: false,
                    coding_tools: true,
                    api_access: false,
                    cloud_agents: false,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false
                }
            },

            {
                plan_id: "cursor_pro",
                plan_name: "Pro",

                pricing: {
                    amount: 20,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: true
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1
                },

                features: {
                    ai_coding: true,
                    chat_access: false,
                    coding_tools: true,
                    api_access: false,
                    cloud_agents: true,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false
                }
            },

            {
                plan_id: "cursor_pro_plus",
                plan_name: "Pro+",

                pricing: {
                    amount: 60,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: true
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1
                },

                features: {
                    ai_coding: true,
                    chat_access: false,
                    coding_tools: true,
                    api_access: false,
                    cloud_agents: true,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false
                },

                metadata: {
                    usage_multiplier: "3x"
                }
            },

            {
                plan_id: "cursor_ultra",
                plan_name: "Ultra",

                pricing: {
                    amount: 200,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: true
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1
                },

                features: {
                    ai_coding: true,
                    chat_access: false,
                    coding_tools: true,
                    api_access: false,
                    cloud_agents: true,
                    team_workspace: false,
                    enterprise_support: true,
                    sso: false
                },

                metadata: {
                    usage_multiplier: "20x",
                    priority_feature_access: true
                }
            },

            {
                plan_id: "cursor_teams",
                plan_name: "Teams",

                pricing: {
                    amount: 40,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "per_user",
                    is_custom_pricing: false,
                    is_usage_based: true
                },

                user_rules: {
                    min_users: 2,
                    max_users: null
                },

                features: {
                    ai_coding: true,
                    chat_access: false,
                    coding_tools: true,
                    api_access: false,
                    cloud_agents: true,
                    team_workspace: true,
                    enterprise_support: false,
                    sso: true
                }
            },

            {
                plan_id: "cursor_enterprise",
                plan_name: "Enterprise",

                pricing: {
                    amount: null,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "custom",
                    is_custom_pricing: true,
                    is_usage_based: true
                },

                user_rules: {
                    min_users: null,
                    max_users: null
                },

                features: {
                    ai_coding: true,
                    chat_access: false,
                    coding_tools: true,
                    api_access: true,
                    cloud_agents: true,
                    team_workspace: true,
                    enterprise_support: true,
                    sso: true
                }
            }
        ]
    },

    {
        vendor_id: "github_copilot",
        vendor_name: "GitHub Copilot",

        plans: [
            {
                plan_id: "github_copilot_free",
                plan_name: "Free",

                pricing: {
                    amount: 0,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: true
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1
                },

                usage_limits: {
                    code_completions_per_month: 2000,
                    chat_requests_per_month: 50
                },

                features: {
                    ai_coding: true,
                    chat_access: true,
                    coding_tools: true,
                    api_access: false,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false
                },

                metadata: {
                    target_audience: [
                        "Individual developers"
                    ]
                }
            },

            {
                plan_id: "github_copilot_pro",
                plan_name: "Pro",

                pricing: {
                    amount: 10,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "per_user",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1
                },

                features: {
                    ai_coding: true,
                    chat_access: true,
                    coding_tools: true,
                    api_access: false,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false
                },

                metadata: {
                    target_audience: [
                        "Individual developers",
                        "Freelancers",
                        "Students"
                    ]
                }
            },

            {
                plan_id: "github_copilot_pro_plus",
                plan_name: "Pro+",

                pricing: {
                    amount: 39,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "per_user",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1
                },

                features: {
                    ai_coding: true,
                    chat_access: true,
                    coding_tools: true,
                    api_access: false,
                    team_workspace: true,
                    enterprise_support: false,
                    sso: false
                },

                metadata: {
                    target_audience: [
                        "Individual developers",
                        "Small teams"
                    ]
                }
            },

            {
                plan_id: "github_copilot_business",
                plan_name: "Business",

                pricing: {
                    amount: 19,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "per_user",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 2,
                    max_users: null
                },

                features: {
                    ai_coding: true,
                    chat_access: true,
                    coding_tools: true,
                    api_access: true,
                    team_workspace: true,
                    enterprise_support: false,
                    sso: true
                },

                metadata: {
                    target_audience: [
                        "Organizations",
                        "Teams"
                    ]
                }
            },

            {
                plan_id: "github_copilot_enterprise",
                plan_name: "Enterprise",

                pricing: {
                    amount: 39,
                    currency: "USD",
                    billing_cycle: "monthly",
                    pricing_model: "per_user",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 10,
                    max_users: null
                },

                features: {
                    ai_coding: true,
                    chat_access: true,
                    coding_tools: true,
                    api_access: true,
                    team_workspace: true,
                    enterprise_support: true,
                    sso: true
                },

                metadata: {
                    requires_github_enterprise_cloud: true,

                    target_audience: [
                        "Large organizations"
                    ]
                }
            }
        ]
    },

    {
        vendor_id: "gemini",
        vendor_name: "Gemini",

        plans: [
            {
                plan_id: "gemini_free",
                plan_name: "Free of charge",

                pricing: {
                    amount: 0,
                    currency: "INR",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1,

                    sharing_allowed: false
                },

                features: {
                    chat_access: true,
                    coding_tools: false,
                    api_access: false,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false,

                    family_sharing: false
                }
            },

            {
                plan_id: "gemini_google_ai_plus",
                plan_name: "Google AI Plus",

                pricing: {
                    amount: 399,
                    currency: "INR",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1,

                    sharing_allowed: true,
                    max_family_members: 5
                },

                features: {
                    chat_access: true,
                    coding_tools: true,
                    api_access: false,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false,

                    family_sharing: true
                },

                metadata: {
                    sharing_platform: "Google One"
                }
            },

            {
                plan_id: "gemini_google_ai_pro",
                plan_name: "Google AI Pro",

                pricing: {
                    amount: 1950,
                    currency: "INR",
                    billing_cycle: "monthly",
                    pricing_model: "fixed",
                    is_custom_pricing: false,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1,

                    sharing_allowed: true,
                    ai_features_individual_only: true
                },

                features: {
                    chat_access: true,
                    coding_tools: true,
                    api_access: true,
                    team_workspace: false,
                    enterprise_support: false,
                    sso: false,

                    family_sharing: true
                },

                metadata: {
                    storage_sharing_supported: true,
                    ai_feature_sharing_supported: false
                }
            },

            {
                plan_id: "gemini_google_ai_ultra",
                plan_name: "Google AI Ultra",

                pricing: {
                    amount: null,
                    currency: "INR",
                    billing_cycle: "monthly",
                    pricing_model: "custom",
                    is_custom_pricing: true,
                    is_usage_based: false
                },

                user_rules: {
                    min_users: 1,
                    max_users: 1,

                    sharing_allowed: false
                },

                features: {
                    chat_access: true,
                    coding_tools: true,
                    api_access: true,
                    team_workspace: false,
                    enterprise_support: true,
                    sso: false,

                    premium_models_access: true
                },

                metadata: {
                    premium_ai_models: true,
                    individual_only_access: true
                }
            }
        ]
    }
];