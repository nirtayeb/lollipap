
import OrganizationRepository from '../../emails/lib/repositories/organizations';
import SenderRepository from '../../emails/lib/repositories/senders';
import { TemplateRepository } from '../lib/repositories/templates';

export default class SubscriptionService {

    static async getCurrentPlan(organizationId: string) {
        const subscription = await OrganizationRepository.getActiveSubscription(organizationId);
        return subscription.plan;
    }

    static async canAddSenders(organizationId: string) {
        const plan = await this.getCurrentPlan(organizationId);
        const verifiedSendersCount = await SenderRepository.countSenders(organizationId);

        return verifiedSendersCount < plan.verifiedSenders;
    }

    static async canAddTemplate(organizationId: string) {
        const plan = await this.getCurrentPlan(organizationId);
        const templatesCount = await TemplateRepository.count(organizationId)
        return templatesCount < plan.emailTemplates;
    }

    static async canSendEmail(organizationId: string) {
        const plan = await this.getCurrentPlan(organizationId);
        const currentEmailUsage = await OrganizationRepository.getCurrentUsage(organizationId);
        return currentEmailUsage.emailsSent < plan.emailLimit;
    }

}