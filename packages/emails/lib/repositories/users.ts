
import prisma from '../prisma';

export class UserRepository {

    static async getUser(email) {
        return await prisma.user.findUnique({where: {email}, include: {accounts: true}});
    }

    
    static async getOrganizationIdByEmail(email: string) {
        const user = await prisma.user.findFirst({where: {email}, include:{organization:true}})
        return user.organization;
    }

    static async updateUserOrg(id: string, organizationId: string) {
        console.log("updateUserOrg", id, organizationId);
        await prisma.user.update({where: {id}, data: {organizationId}});
    }

}