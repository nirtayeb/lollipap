
import SendersAdmin from "../../comps/SendersTable";
import SenderRepository from "../../lib/repositories/senders";
import MailService from '../../services/mailer-service';
import { UserService } from "../../services/user-service";
import SubscriptionService from "../../services/subscription-service";


export const dynamic = 'force-dynamic'

export default async function SendersList() {
    const orgId = await UserService.getOrganizationIdNoReq();
    let senders = await SenderRepository.getSendersByOrganization(orgId);
    const canAddSenders = await SubscriptionService.canAddSenders(orgId);
    const sendersEmails = senders.map(s => s.email);
    const verifyStatuses = await MailService.listVerificationStatus(sendersEmails);

    senders = senders.map(sender => {
        const verified = sender.email in verifyStatuses?verifyStatuses[sender.email]['VerificationStatus']:'Resend required';
        return {...sender, verified: verified};
    });
  
    return (
        <SendersAdmin senders={senders} limitReached={!canAddSenders} />
    )

}
