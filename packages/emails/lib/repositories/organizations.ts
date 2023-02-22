
import prisma from '../prisma';

export default class OrganizationRepository {

    static async exists(id: string){
        const org = await prisma.organization.findUnique({where: {id}})
        return !!org
    }

    static async create(id: string) {
        return await prisma.organization.create({data: {id}});
    }

}