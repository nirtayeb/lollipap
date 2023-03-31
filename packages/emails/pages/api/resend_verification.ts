import SenderRepository from '../../lib/repositories/senders';
import MailService from '../../services/mailer-service';
import { UserService } from "packages/emails/services/user-service";


const handlePost = async(req, res) => {
    const { senderId } = req.body;
    const orgId = await UserService.getOrganizationId(req, res);
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