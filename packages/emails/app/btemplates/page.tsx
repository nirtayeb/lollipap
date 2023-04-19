
import { TemplateRepository } from '../../lib/repositories/templates';
import TemplateAdmin from '../../comps/TemplatesTable';
import SubscriptionService from "../../../emails/services/subscription-service";
import { UserService } from '../../../emails/services/user-service';


export const dynamic = 'force-dynamic'

export default async function TemplatesList() {
    const orgId = await UserService.getOrganizationIdNoReq();
    console.log(orgId)
    const templates = await TemplateRepository.getTemplateByOrganization(orgId);
    const canAddTemplate = await SubscriptionService.canAddTemplate(orgId)
  
    return (
        <TemplateAdmin templates={templates} reachedLimit={!canAddTemplate} />
    )

}
