
import jwt from "jsonwebtoken";


export function getMondayToken(authorization: string) {
    console.log("getMondayToken", authorization);
    const { accountId, userId, backToUrl, shortLivedToken, subscription } = jwt.verify(
        authorization,
        "52f61876ae5bfcf9d2e6a4a05d168ab9", // process.env.MONDAY_SIGNING_SECRET
      ) as any;

    return  { accountId, userId, backToUrl, shortLivedToken, subscription  }
}
