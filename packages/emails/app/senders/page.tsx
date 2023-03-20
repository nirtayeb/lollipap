
import { getServerSession } from "next-auth";
import SendersAdmin from "packages/emails/comps/SendersTable";
import SenderRepository from "packages/emails/lib/repositories/senders";
import { authOptions } from "packages/emails/pages/api/auth/[...nextauth]";

import { UserRepository } from '../../lib/repositories/users';
import MailService from '../../services/mailer-service';


export const dynamic = 'force-dynamic'

export default async function SendersList() {

    const session = await getServerSession(authOptions)

    console.log("Inside page", session);
    const currentUser = await UserRepository.getUser(session.user.email);
    console.log("Current user", currentUser);
    let senders = await SenderRepository.getSendersByOrganization(currentUser.accounts[0].providerAccountId);

    const sendersEmails = senders.map(s => s.email);
    const verifyStatuses = await MailService.listVerificationStatus(sendersEmails);

    senders = senders.map(sender => {
        const verified = sender.email in verifyStatuses?verifyStatuses[sender.email]['VerificationStatus']:'Resend required';
        return {...sender, verified: verified};
    });
  
    return (
        <SendersAdmin senders={senders} />
    )

    //console.log(senders);
}

/*

  

*/