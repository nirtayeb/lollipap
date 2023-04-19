import { TemplateRepository } from '../../../lib/repositories/templates';
import SubscriptionService from '../../../services/subscription-service';
import { getAccountId } from "../../../lib/monday";


const handleGet = async (req, res, orgId) => {
    const templates = await TemplateRepository.getTemplateByOrganization(orgId);
    const canAddTemplate = await SubscriptionService.canAddTemplate(orgId)

    res.json({
        templates,
        reachedLimit: !canAddTemplate
    });
}

const handlePost = async (req, res, orgId) => {
    const { name, content, templateId } = req.body;
    let template;
    
    if(templateId) {
        template = await TemplateRepository.update(orgId, templateId, name, content);
        res.status(200).json(template);
        return;
    }

    if(!await SubscriptionService.canAddTemplate(orgId)){
        res.status(401).json({error: "You've reached your plan limits"});
        return;
    }

    template = await TemplateRepository.createTemplate(orgId, name, content);
    res.status(200).json(template);
    return;

}

const handleDelete = async(req, res, orgId) => {
    const { templateId } = req.body;

    const deleted = await TemplateRepository.deleteTemplate(orgId, templateId)
    res.status(200).json({ok: deleted})
}


const handler = async (req, res) => {

    let accountId;
    try{
        accountId = getAccountId(req);
    }catch(error){
        res.status(401).json({});
        return;
    }

    switch(req.method){
        case 'POST':
            await handlePost(req, res, accountId);
            break;
        case 'DELETE':
            await handleDelete(req, res, accountId);
            break;
        case 'GET':
            await handleGet(req, res, accountId);
            break;
        default:
            res.status(405).json({ok:false});
    }    
}


export default handler