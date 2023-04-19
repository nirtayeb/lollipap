import { getMondayToken } from '../../../emails/lib/monday';
import mailService from '../../../emails/services/mailer-service';
import { TemplateRepository } from '../../lib/repositories/templates';
import MondayService from '../../../emails/services/monday-service';
import SubscriptionService from '../../services/subscription-service';
import OrganizationRepository from '../../../emails/lib/repositories/organizations';


async function handler(req, res) {

  const authorization = req.headers.authorization ?? req.query.token as string;
  const { accountId, shortLivedToken } = getMondayToken(authorization);
  const { payload } = req.body;

  console.log(accountId, payload);

  if(!await SubscriptionService.canSendEmail(accountId)){
    console.log("Reached plan limit, cannot send email");
    res.status(200).send({});
    return;
  }

  try {
    const { inboundFieldValues } = payload;
    const { boardId, email, templateId, itemId } = inboundFieldValues;

    const template = await TemplateRepository.getTemplate(parseInt(templateId.value), accountId)

    const varRegex = /{{.+?}}/g;
    const removeVar = /[{}]/g;
    const placeHolders = template.content.match(varRegex);

    const item = await MondayService.getItem(shortLivedToken,boardId, itemId);
    console.log(item);

    const colValsMap = new Map(item.column_values.map((col) => [col.id.toLowerCase(), col.text]));
    colValsMap.set("name", item.name);

    let content = template.content;

    placeHolders.forEach((ph: string) => {
      const phName = ph.replace(removeVar, "").toLowerCase();
      const colVal = colValsMap.get(phName);
      console.log(phName, colVal);
      content = content.replaceAll(ph, colVal);
    });

    console.log(content);

    await mailService.sendEmail('devweekendapps@gmail.com', 'devweekendapps@gmail.com', [email], 'TEst', content);
    await OrganizationRepository.increaseMailUsage(accountId);

    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }

}

export default handler
