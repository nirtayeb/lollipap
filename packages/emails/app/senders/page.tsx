
import { getServerSession } from "next-auth";
import SendersAdmin from "packages/emails/comps/SendersTable";
import SenderRepository from "packages/emails/lib/repositories/senders";
import { authOptions } from "packages/emails/pages/api/auth/[...nextauth]";

import { UserRepository } from '../../lib/repositories/users';


export const dynamic = 'force-dynamic'

export default async function SendersList() {

    const session = await getServerSession(authOptions)

    console.log("Inside page", session);
    const currentUser = await UserRepository.getUser(session.user.email);
    console.log("Current user", currentUser);
    const senders = await SenderRepository.getSendersByOrganization(currentUser.accounts[0].providerAccountId);
  
    return (
        <SendersAdmin senders={senders} />
    )

    //console.log(senders);
}

/*

  

*/