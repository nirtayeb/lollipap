import jwt from "jsonwebtoken";


export function getMondayToken(authorization: string) {
    console.log("getMondayToken", authorization);
    const { accountId, userId, backToUrl, shortLivedToken } = jwt.verify(
      authorization,
      process.env.MONDAY_SIGNING_SECRET
    ) as any;

  return  { accountId, userId, backToUrl, shortLivedToken }
}

export function verifyClientMondayToken(authorization: string) {
  const data = jwt.verify(
    authorization,
    process.env.MONDAY_CLIENT_SECRET
  )

  return data.dat;
}


export function getAccountId(req) {
  const token = req.query.token;
  const { account_id } = verifyClientMondayToken(token);
  const accountId = account_id.toString();
  console.log("accountId", accountId);
  return accountId;
}