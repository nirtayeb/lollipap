import prisma from "../prisma";
import { Prisma } from '@prisma/client';

class SenderRepository {

    static async getSendersByOrganization(organizationId: string) {
        return await prisma.sender.findMany({where: {organizationId}})
    }

    static async get(senderId: number, organizationId: string) {
        return await prisma.sender.findFirst({where: {id: senderId, organizationId}})
    }

    static async markVerified(id: number) {
        const updateSender = await prisma.sender.update({where: {id}, data:{status:1} });
        return updateSender;
    }

    static async add(organizationId: string, name: string, email: string) {
        return await prisma.sender.create({
            data: {
              name: name,
              email: email,
              organization:{connect: { id: organizationId} as Prisma.OrganizationWhereUniqueInput}
            } as Prisma.SenderCreateInput,
          });
    }

    static async remove(email: string){
        await prisma.sender.delete({where: {email}});
    }

    static async countSenders(organizationId: string) {
        return await prisma.sender.count({where: {organizationId}})
    }

}

export default SenderRepository