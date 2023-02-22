
import { getServerSession } from "next-auth";
import { authOptions } from "packages/emails/pages/api/auth/[...nextauth]";

import { UserRepository } from '../../lib/repositories/users';
import { TemplateRepository } from '../../lib/repositories/templates';
import TemplateAdmin from '../../comps/TemplatesTable';


export const dynamic = 'force-dynamic'

export default async function TemplatesList() {
    const session = await getServerSession(authOptions)
    const currentUser = await UserRepository.getUser(session.user.email);
    const templates = await TemplateRepository.getTemplateByOrganization(currentUser.accounts[0].providerAccountId);
  
    return (
        <TemplateAdmin templates={templates} />
    )

}
