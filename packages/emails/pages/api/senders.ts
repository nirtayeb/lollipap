import SenderRepository from '../../../emails/lib/repositories/senders';
import MailService from '../../services/mailer-service';
import SubscriptionService from '../../services/subscription-service';
import { getAccountId } from '../../../emails/lib/monday';


const handleGet = async (accountId, req, res) => { 
  let senders = await SenderRepository.getSendersByOrganization(accountId);
  const canAddSenders = await SubscriptionService.canAddSenders(accountId);
  const sendersEmails = senders.map(s => s.email);
  const verifyStatuses = await MailService.listVerificationStatus(sendersEmails);

  senders = senders.map(sender => {
      const verified = sender.email in verifyStatuses?verifyStatuses[sender.email]['VerificationStatus']:'Resend required';
      return {...sender, verified: verified};
  });

  res.json({
    senders,
    limitReached: !canAddSenders
  });

}

const handleDelete = async (accountId, req, res) => {
  const { email } = req.body;
    try{
        await MailService.removeEmailIdentity(email)
        await SenderRepository.remove(email);
        res.status(200).json({ok:true})
    }
    catch(err){
        console.log(err);
        res.status(500).json({ok:false})
    }
}

const handlePost = async (organizationId, req, res) => {

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

  if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
    res.status(405).json({});
    return
  }

  let accountId;
  try{
    accountId = getAccountId(req);
  }catch(error){
    res.status(401).json({});
    return;
  }

  if (req.method == 'DELETE') {
    await handleDelete(accountId, req, res);
    return
  }

  if (req.method == 'POST') {
    await handlePost(accountId, req, res);
    return;
  }

  if (req.method == 'GET') {
    await handleGet(accountId, req, res);
    return;
  }

  console.log("WTF")
  res.status(500).json({})
};

export default handler;


