
import { getMondayToken } from 'packages/emails/lib/monday';
import OrganizationRepository from 'packages/emails/lib/repositories/organizations';


const handleInstall = async (data, req, res) => {
    const accountId = data.account_id;
    const exists = await OrganizationRepository.exists(accountId);
      console.log('ORg exists?', exists);
      if (!exists) {
       const org = await OrganizationRepository.create(accountId);
       console.log("Org created", org);
      }
}

const handleUninstall = async (data, req, res) => {
    const accountId = data.account_id;
    await OrganizationRepository.deactivate(accountId);
}

const handlePurchase = async (data, req, res) => {

}

const handleCancel = async (data, req, res) => {

}

const handleSubscriptionChange = async (data, req, res) => {

}

const handleSubscriptionRenewal = async (data, req, res) => {

}


const MAP_HANDLERS = {
    "install": handleInstall,
    "uninstall": handleUninstall,
    "app_subscription_created": handlePurchase,
    "app_subscription_cancelled_by_user": handleCancel,
    "app_subscription_changed": handleSubscriptionChange,
    "app_subscription_renewed": handleSubscriptionRenewal,
}

const handler = async (req, res) => {

    const authorization = req.headers.authorization ?? req.query.token as string;
    const { accountId, userId } = getMondayToken(authorization);

    const webhookData = req.body;

    if(!("type" in webhookData)){
        res.status(400).json({"error": "malformed webhook data"})
        return;
    }

    const { type, data } = webhookData;

    if(type in MAP_HANDLERS){
        const handler = MAP_HANDLERS[type];
        await handler(data, req, res);
        res.status(200).json({ok:true})
    }

    console.log(`Unsupported webhook type: ${type}`);
    res.status(200).json({ok:true})
}

export default handler;