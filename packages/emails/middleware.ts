import { withAuth } from "next-auth/middleware"
import {SignJWT, jwtVerify, type JWTPayload} from 'jose';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log(req.nextauth.token)
  },
  {
    callbacks: {
      authorized: async ({ req, token }) =>  {
        return true;
        console.log("Got token from oauth", token)
        if(token){
          return true;
        }
        console.log(req.nextUrl.searchParams.get('sessionToken'));
        const sessionToken = req.nextUrl.searchParams.get('sessionToken');

        const textEncoder = new TextEncoder();
        const secret = textEncoder.encode(process.env.MONDAY_SIGNING_SECRET);

        try{
          const { payload, protectedHeader } = await jwtVerify(sessionToken, secret);
          console.log(payload, protectedHeader);
        }catch(error){
          console.log(error);
          return false;
        }
        
        return true;
      },
    },
  }
)

export const config = { matcher: ["/"] }
