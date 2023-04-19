import { SES, config } from 'aws-sdk';

class MailService {

  static getSESClient() {
    return new SES({ apiVersion: '2010-12-01', region: 'eu-central-1' });
  }

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

    const ses = this.getSESClient()

    try {
      const response = await ses.sendEmail(params).promise();
      console.log(response.MessageId);
    } catch (error) {
      console.log(error.stack);
      return false;
    }

    return true;
  }

  static async removeEmailIdentity(email: string) {
    const ses = this.getSESClient();

    try {
      const response = await ses.deleteVerifiedEmailAddress({EmailAddress: email}).promise();
      console.log("Email verification initiated", response);
    }catch(error){
      console.log(error);
      return false;
    }

    return true;
  }

  static async verifyEmailIdentity(email: string) {
    const ses = this.getSESClient();
    try{
      console.log("starting");
      // const response = await ses.sendCustomVerificationEmail({EmailAddress: email, TemplateName: "SampleTemplate"}).promise();
      const response = await ses.verifyEmailIdentity({EmailAddress: email}).promise();
    console.log("Email verification initiated", response);
    }catch(error){
      console.log(error.stack);
      return false;
    }

    return true;
  }

  static async listVerificationStatus(emails: string[]) {
    const ses = this.getSESClient();
    let response;

    try{
      response = await ses.getIdentityVerificationAttributes({Identities: emails}).promise();
    }catch(error){
      console.log(error.stack);
      return {}
    }

    return response.VerificationAttributes;
  }
}

export default MailService;
