
import prisma from '../prisma';

export default class OrganizationRepository {

    static async get(id: string){
        return await prisma.organization.findUnique({where: {id}})
    }

    static async create(id: string) {
        return await prisma.organization.create({data: {id}});
    }

    static async activate(id: string) {
        return await prisma.organization.update({where:{id}, data:{active:true}});
    }

    static async deactivate(id: string){
        return await prisma.organization.update({where:{id}, data:{active:false}});
    }


    static async subscribe(id: string, subscriptionData: Subscription) {

        const [updateResults, subscription] = await prisma.$transaction([
            prisma.subscription.update({where: {organizationId: id}, data: {active: false}}),
            prisma.subscription.create({
                data: {
                    isTrial: subscriptionData.is_trial,
                    renewalDate: new Date(subscriptionData.renewal_data),
                    billingPeriod: subscriptionData.billing_period,
                    pricingVersion: subscriptionData.pricing_version,
                    active: true,
                    organizationId: id,
                    planId: subscriptionData.plan_id
                },
            })
        ])

        return subscription;
    }

    static async unsubscribe(id: string) {
        await prisma.subscription.updateMany({
            where: { organizationId: id, active: true },
            data: { active: false },
        });
    }

    static async getActiveSubscription(id: string){
        return await prisma.subscription.findFirst({where: {
            organizationId: id, active: true
        }, include: {plan: true}});
    }

    static async getCurrentUsage(id: string){
        const currentDate = new Date();
        const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        let currentEmailUsage = await prisma.emailUsage.findFirst({where: {
            organizationId: id, isCurrent:true, 
        }})

        if (!currentEmailUsage || currentEmailUsage.periodEnd < currentMonthEnd) {
            await prisma.emailUsage.updateMany({
              where: { organizationId: id, isCurrent: true },
              data: { isCurrent: false },
            });
         
            currentEmailUsage = prisma.emailUsage.create({
              data: {
                organizationId: id,
                emailsSent: 0,
                periodStart: currentMonthStart,
                periodEnd: currentMonthEnd,
                isCurrent: true,
              },
            });
          }
        

        return currentEmailUsage;

    }

    static async increaseMailUsage(id: string) {
        const currentUsage = await this.getCurrentUsage(id);
        await prisma.emailUsage.update({where:{id:currentUsage.id}, data:{emailsSent: {increment: 1}}});
    }

}