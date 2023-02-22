import mondayService from 'packages/emails/services/monday-service';
import { getMondayToken } from 'packages/emails/lib/monday';
import mailService from 'packages/emails/services/mailer-service';
import { TemplateRepository } from '../../lib/repositories/templates';
import MondayService from 'packages/emails/services/monday-service';
import { contentColors } from 'monday-ui-react-core/dist/types/utils/colors-vars-map';


async function handler(req, res) {

  const authorization = req.headers.authorization ?? req.query.token as string;
  const { shortLivedToken, userId } = getMondayToken(authorization);
  const { payload } = req.body;

  console.log(payload);

  try {
    const { inboundFieldValues } = payload;
    const { boardId, email, templateId, itemId } = inboundFieldValues;

    const template = await TemplateRepository.getTemplate(parseInt(templateId.value), userId)

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

    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }

}

export default handler
