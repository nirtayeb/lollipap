
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { UserRepository } from '../../lib/repositories/users';
import { TemplateRepository } from '../../lib/repositories/templates';

const handlePost = async(req, res) => {
    const session= await getServerSession(req, res, authOptions) as Session;
    const user = await UserRepository.getUser(session.user.email)
    const { templateId } = req.body;

    const template = await TemplateRepository.duplicate(user.accounts[0].providerAccountId.toString(), templateId);
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