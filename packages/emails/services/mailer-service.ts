import { SES, config } from 'aws-sdk';

class MailService {
  static async sendEmail(
    fromAddress: string,
    replytoAddess: string,
    toEmailAddresses: string[],
    subject: string,
    body: string
  ) {
    console.log({fromAddress, replytoAddess, toEmailAddresses})
    const params = {
      Destination: {
        /* required */ ToAddresses: toEmailAddresses,
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
          Text: {
            Charset: 'UTF-8',
            Data: '',
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: fromAddress /* required */,
      ReplyToAddresses: [replytoAddess],
    };

    const ses = new SES({ apiVersion: '2010-12-01', region: 'eu-central-1' });

    try {
      const response = await ses.sendEmail(params).promise();
      console.log(response.MessageId);
    } catch (error) {
      console.log(error.stack);
      return false;
    }

    return true;
  }
}

export default MailService;
