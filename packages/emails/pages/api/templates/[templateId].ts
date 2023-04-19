import { getAccountId } from "../../../lib/monday";
import { TemplateRepository } from "../../../lib/repositories/templates";


const Template = async (req, res) => {

    let accountId;
    try{
        accountId = getAccountId(req);
    }catch(error){
        res.status(401).json({});
        return;
    }

    const { templateId } = req.query;
    const template = await TemplateRepository.getTemplate(parseInt(templateId), accountId);
    res.status(200).json(template);
}


export default Template;