
import prisma from '../prisma';

export class UserRepository {

    static async getUser(email) {
        return await prisma.user.findUnique({where: {email}, include: {accounts: true}});
    }

    
    static async getOrganizationIdByEmail(email: string) {
        const account = await prisma.account.findFirst({where: {user: {email}}})
        return account.providerAccountId
    }

}