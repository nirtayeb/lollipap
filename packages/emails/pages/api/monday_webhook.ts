
import { getMondayToken } from 'packages/emails/lib/monday';
import OrganizationRepository from 'packages/emails/lib/repositories/organizations';


const handleInstall = async (accountId, data: WebhookData, req, res) => {
    const org = await OrganizationRepository.get(accountId);
      console.log('Org exists?', !!org);

      if(!org){
        await OrganizationRepository.create(accountId);
      }else if(!org.active){
        await OrganizationRepository.activate(accountId);
      }

      if(data.subscription) {
        await OrganizationRepository.subscribe(accountId, data.subscription);
      }

}

const handleUninstall = async (accountId, data, req, res) => {
    await OrganizationRepository.deactivate(accountId);
}

const handlePurchase = async (accountId, data, req, res) => {
    await OrganizationRepository.subscribe(accountId, data.subscription);
    console.log("subscribed")
}

const handleCancel = async (accountId, data, req, res) => {
    await OrganizationRepository.unsubscribe(accountId);
    console.log("unsubscribed")
}

const handleSubscriptionChange = async (accountId, data, req, res) => {
    await OrganizationRepository.subscribe(accountId, data.subscription);
    console.log("subscription changed")
}

const handleSubscriptionRenewal = async (accountId, data, req, res) => {
    await OrganizationRepository.subscribe(accountId, data.subscription);
    console.log("subscription renewed")
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

    console.log("Got Monday webhook", req.headers, req.body);

    const authorization = req.headers.authorization ?? req.query.token as string;
    const { accountId, userId } = getMondayToken(authorization);

    const webhookData = req.body;

    console.log("Got Monday webhook", webhookData);

    if(!("type" in webhookData)){
        res.status(400).json({"error": "malformed webhook data"})
        return;
    }

    const { type, data } = webhookData;

    if (!(type in MAP_HANDLERS)){
        console.log(`Unsupported webhook type: ${type}`);
        res.status(200).json({ok:true})
        return;
    }

    const handler = MAP_HANDLERS[type];
    const orgId = data.account_id.toString();
    await handler(orgId, data, req, res);
    res.status(200).json({ok:true})
    
}

export default handler;