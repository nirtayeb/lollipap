import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { UserRepository } from '../../lib/repositories/users';
import { TemplateRepository } from '../../lib/repositories/templates';
import { UserService } from "packages/emails/services/user-service";
import SubscriptionService from '../../services/subscription-service';


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

const handleGet = async (req, res, orgId) => {
    const { templateId } = req.query;
    const template = await TemplateRepository.getTemplate(parseInt(templateId), orgId);
    res.status(200).json(template);
}

const handler = async (req, res) => {

    const orgId = await UserService.getOrganizationId(req, res);

    switch(req.method){
        case 'POST':
            await handlePost(req, res, orgId);
            break;
        case 'DELETE':
            await handleDelete(req, res, orgId);
            break;
        case 'GET':
            await handleGet(req, res, orgId);
            break;
        default:
            res.status(405).json({ok:false});
    }    
}


export default handler