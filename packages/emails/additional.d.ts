declare module "iron-session" {
    interface IronSessionData {
      user?: {
        accountId: string, 
        userId: string, 
        backToUrl: string, 
        shortLivedToken: string,
    }
  }
}