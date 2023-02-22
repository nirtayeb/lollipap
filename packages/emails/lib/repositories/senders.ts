import prisma from "../prisma";

class SenderRepository {

    static async getSendersByOrganization(organizationId: string) {
        return await prisma.sender.findMany({where: {organizationId}})
    }

    static async markVerified(id: string) {
        const updateSender = await prisma.sender.update({where: {id}, data:{status:1} });
        return updateSender;
    }

    static async add(organizationId: string, email: string) {
        const sender = await prisma.sender.create({data:{organizationId, email, status:0}});
        return sender;
    }

    static async remove(email: string){
        await prisma.sender.delete({where: {email}});
    }

}

export default SenderRepository