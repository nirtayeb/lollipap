import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { UserRepository } from '../../lib/repositories/users';
import MondayService  from '../../services/monday-service';


const handler = async (req, res) => {
    const session= await getServerSession(req, res, authOptions) as Session;
    const user = await UserRepository.getUser(session.user.email)
    const columns = await MondayService.getAllColumns(user.accounts[0].access_token);
    res.status(200).json(columns);
}

export default handler;
