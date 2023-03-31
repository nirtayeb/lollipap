import { TemplateRepository } from '../../lib/repositories/templates';
import { getMondayToken } from "packages/emails/lib/monday";


const handler = async (req, res) => {
    console.log("TemplatesGET", req.headers.authorization, req.query.token);
    const authorization = req.headers.authorization ?? req.query.token as string;
    const { accountId, userId } = getMondayToken(authorization);

    console.log("TemplatesGET", accountId, userId);

    const templates = await TemplateRepository.getTemplateByOrganization(accountId.toString());
    const options = templates.map((template)=>({title: template.name, value: template.id.toString()}))
    console.log("Templates", options)

    res.status(200).send({
        options,
        isPaginated: false
    });

}

export default handler;