import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { UserRepository } from '../../lib/repositories/users';
import { TemplateRepository } from '../../lib/repositories/templates';


const getAccountId = async (req, res) => {
    const session= await getServerSession(req, res, authOptions) as Session;
    const user = await UserRepository.getUser(session.user.email)
    return user.accounts[0].providerAccountId.toString();
}

const handlePost = async (req, res) => {
    const orgId = await getAccountId(req, res)
    const { name, content, templateId } = req.body;
    let template;
    
    if(templateId) {
        template = await TemplateRepository.update(orgId, templateId, name, content);
    }else{
        template = await TemplateRepository.createTemplate(orgId, name, content);
    }

    res.status(200).json(template);
}

const handleDelete = async(req, res) => {
    const session= await getServerSession(req, res, authOptions) as Session;
    const user = await UserRepository.getUser(session.user.email)
    const { templateId } = req.body;

    const deleted = await TemplateRepository.deleteTemplate(user.accounts[0].providerAccountId.toString(), templateId)
    res.status(200).json({ok: deleted})
}

const handleGet = async (req, res) => {
    const organizationId = await getAccountId(req, res);
    const { templateId } = req.query;
    const template = await TemplateRepository.getTemplate(parseInt(templateId), organizationId);
    res.status(200).json(template);
}

const handler = async (req, res) => {
    switch(req.method){
        case 'POST':
            await handlePost(req, res);
            break;
        case 'DELETE':
            await handleDelete(req, res);
            break;
        case 'GET':
            await handleGet(req, res);
            break;
        default:
            res.status(405).json({ok:false});
    }    
}


export default handler