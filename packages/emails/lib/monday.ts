
import jwt from "jsonwebtoken";


export function getMondayToken(authorization: string) {
    const { accountId, userId, backToUrl, shortLivedToken, subscription } = jwt.verify(
        authorization,
        process.env.MONDAY_SIGNING_SECRET
      ) as any;

    return  { accountId, userId, backToUrl, shortLivedToken, subscription  }
}
