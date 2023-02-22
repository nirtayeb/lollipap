
import prisma from '../prisma';
import { Prisma } from '@prisma/client';

export class TemplateRepository {

    static async getTemplateByOrganization(organizationId: string) {
        return await prisma.template.findMany({where: {organizationId}});
    }

    static async createTemplate(organizationId: string, name: string, content: string) {
        const data = {name, content, organization:{connect:{id: organizationId}}};
        return await prisma.template.create({data})
    }

    static async getTemplate(templateId:number , organizationId: string) {
        return await prisma.template.findUnique({where: {id: templateId}})
    }

}