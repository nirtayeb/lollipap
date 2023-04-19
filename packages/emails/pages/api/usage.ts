import OrganizationRepository from "../../lib/repositories/organizations";
import { getAccountId } from "../../lib/monday";
import SubscriptionService from "../../services/subscription-service";
import { TemplateRepository } from "../../lib/repositories/templates";
import SenderRepository from "../../lib/repositories/senders";


const handler = async (req, res) => {
    console.log("Got Request", req.method, req.body)
  
    if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
      res.status(405).json({});
      return
    }
  
    let organizationId;
    try{
        organizationId = getAccountId(req);
    }catch(error){
      res.status(401).json({});
      return;
    }

    const currentUsage = await OrganizationRepository.getCurrentUsage(organizationId);
    const currentPlan = await SubscriptionService.getCurrentPlan(organizationId);
    const templateUsage =  await TemplateRepository.count(organizationId);
    const verifiedSendersCount = await SenderRepository.countSenders(organizationId);

    res.json({
        emailsSent: currentUsage.emailsSent,
        plan: currentPlan,
        templateUsage,
        verifiedSendersCount
    });
  
}

export default handler;