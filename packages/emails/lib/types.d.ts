interface VersionData {
    major: number;
    minor: number;
    patch: number;
    type: string;
}

interface Subscription {
    plan_id: string;
    renewal_data: string;
    is_trial: boolean;
    billing_period: string;
    days_left: number;
    pricing_version?: number;
}

interface WebhookData {
    app_id: number;
    user_id: number;
    user_email: string;
    user_cluster: string
    account_tier: string;
    account_max_users: number;
    account_id: number;
    version_data: VersionData;
    timestamp: string;
    subscription?: Subscription;
}
