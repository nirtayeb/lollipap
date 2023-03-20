import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { UserRepository } from '../../lib/repositories/users';
import SenderRepository from '../../lib/repositories/senders';
import MailService from '../../services/mailer-service';


const handlePost = async(req, res) => {
    const session= await getServerSession(req, res, authOptions) as Session;
    const user = await UserRepository.getUser(session.user.email);
    const { senderId } = req.body;
    const orgId = user.accounts[0].providerAccountId.toString()
    const sender = await SenderRepository.get(senderId, orgId);

    const email = sender.email;
    const sent = MailService.verifyEmailIdentity(email)
    res.status(200).json({status: sent})
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