import { getServerSession } from "next-auth/next";
import { UserRepository } from '../lib/repositories/users';
import MondayService from "../../emails/services/monday-service";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { Session } from "next-auth";
import { jwtVerify } from "jose";


export class UserService {
    
    static async getOrganizationId(req, res){
        const session= await getServerSession(req, res, authOptions) as Session;

        if(!session){
            const textEncoder = new TextEncoder();
            const secret = textEncoder.encode(process.env.MONDAY_SIGNING_SECRET);
            const sessionToken = req.nextUrl.searchParams.get('sessionToken');
            const  {result, keys} = await jwtVerify(sessionToken, secret);
            return keys['accountId'];

        }

        const user = await UserRepository.getUser(session.user.email);
        const mondayUser = await MondayService.getCurrentUser(user.accounts[0].access_token);
        return mondayUser.account.id.toString()
    }

    static async getOrganizationIdNoReq(){
        const session = await getServerSession(authOptions)
        const currentUser = await UserRepository.getUser(session.user.email);
        const mondayUser = await MondayService.getCurrentUser(currentUser.accounts[0].access_token);
        return mondayUser.account.id.toString()
    }

}