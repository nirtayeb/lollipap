
import { TemplateRepository } from '../../lib/repositories/templates';
import SubscriptionService from '../../services/subscription-service';
import { getAccountId } from '../..//lib/monday';

const handlePost = async(req, res) => {
    let orgId;
    try{
        orgId = getAccountId(req);
    }catch(error){
        res.status(401).json({});
        return;
    }

    if(!await SubscriptionService.canAddTemplate(orgId)){
        res.status(401).json({error: "You've reached your plan limits"});
        return;
    }

    const { templateId } = req.body;
    const template = await TemplateRepository.duplicate(orgId, templateId);

    res.status(200).json(template);
}

const handler = async (req, res) => {
    switch(req.method){
        case 'POST':
            await handlePost(req, res);
            break;
        default:
            res.status(405).json({ok:false});
    }    
}

export default handler;