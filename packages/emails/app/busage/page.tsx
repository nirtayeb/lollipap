
import UsagePage from '../../comps/UsagePage';
import SubscriptionService from "../../../emails/services/subscription-service";
import { UserService } from '../../../emails/services/user-service';
import OrganizationRepository from '../../../emails/lib/repositories/organizations';
import { TemplateRepository } from '../../../emails/lib/repositories/templates';
import SenderRepository from '../../../emails/lib/repositories/senders';


export const dynamic = 'force-dynamic'

export default async function TemplatesList() {
    const organizationId = await UserService.getOrganizationIdNoReq();
    const currentUsage = await OrganizationRepository.getCurrentUsage(organizationId);
    const currentPlan = await SubscriptionService.getCurrentPlan(organizationId);
    const templateUsage =  await TemplateRepository.count(organizationId);
    const verifiedSendersCount = await SenderRepository.countSenders(organizationId);
  
    return (
        <UsagePage emailUsage={currentUsage.emailsSent} 
        templateUsage={templateUsage}
        sendersCount={verifiedSendersCount}
        plan={currentPlan} />
    )

}
