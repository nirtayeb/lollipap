
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

    static async deleteTemplate(organizationId: string, templateId: number){
        return await prisma.template.delete({where: {id: templateId }});
    }

    static async duplicate(organizationId: string, templateId: number){
        const template = await prisma.template.findUnique({where: {id: templateId}})
        delete template.id;

        return await prisma.template.create({data: template});

    }

    static async update(organizationId, templateId, name, content) {
        return await prisma.template.update({where: {id: templateId}, data: {name, content}});
    }

    static async count(organizationId: string) {
        return await prisma.template.count({where: {organizationId}});
    }

}