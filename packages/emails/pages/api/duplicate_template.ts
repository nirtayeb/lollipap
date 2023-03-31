
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { UserRepository } from '../../lib/repositories/users';
import { TemplateRepository } from '../../lib/repositories/templates';
import { UserService } from "packages/emails/services/user-service";

const handlePost = async(req, res) => {
    const orgId = await UserService.getOrganizationId(req, res);
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