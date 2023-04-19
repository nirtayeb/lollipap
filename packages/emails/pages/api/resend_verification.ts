import { getAccountId } from '../../lib/monday';
import SenderRepository from '../../lib/repositories/senders';
import MailService from '../../services/mailer-service';


const handlePost = async(req, res) => {
    const { senderId } = req.body;
    let orgId;
    try{
        orgId = getAccountId(req);
    }catch(error){
        res.status(401).json({});
        return;
    }
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