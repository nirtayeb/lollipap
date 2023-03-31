import { getServerSession } from 'next-auth/next';
import SenderRepository from 'packages/emails/lib/repositories/senders';
import { authOptions } from './auth/[...nextauth]';
import { UserRepository } from '../../lib/repositories/users';
import MailService from '../../services/mailer-service';
import SubscriptionService from '../../services/subscription-service';
import MondayService from 'packages/emails/services/monday-service';


const handleDelete = async (req, res) => {
    try{
        await SenderRepository.remove(req.body.email);
        res.status(200).json({ok:true})
    }
    catch(err){
        console.log(err);
        res.status(500).json({ok:false})
    }
}


const handlePost = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  const user = await UserRepository.getUser(session.user.email);
  const mondayUser = await MondayService.getCurrentUser(user.accounts[0].access_token);
  const organizationId = mondayUser.account.id.toString()

  const {name, email} = req.body;
    try {
      if (!await SubscriptionService.canAddSenders(organizationId)){
        console.log("Plan limit reached for organization", organizationId);
        res.status(401).json({ok: false, error: "Plan limit reached"})
        return;
      }

      await SenderRepository.add(organizationId, name, email);
      await MailService.verifyEmailIdentity(req.body.email);
        res.status(200).json({ ok: true });
        
    } catch (err) {
      console.log(err);
      res.status(500).json({ ok: false });
    }
}

const handler = async (req, res) => {
  console.log("Got Request", req.method, req.body)

  if (req.method != 'POST' && req.method != 'DELETE') {
    res.status(405).json({});
    return
  }

  if (req.method == 'DELETE') {
    await handleDelete(req, res);
    return
  }

  if (req.method == 'POST') {
    await handlePost(req, res);
    return;
  }

  console.log("WTF")
  res.status(500).json({})
};

export default handler;
