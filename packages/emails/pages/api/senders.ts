import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import SenderRepository from 'packages/emails/lib/repositories/senders';
import prisma from '../../lib/prisma';
import { authOptions } from './auth/[...nextauth]';
import { UserRepository } from '../../lib/repositories/users';
import MailService from '../../services/mailer-service';


const handleDelete = async (req, res, orgnizationId) => {
    try{
        await SenderRepository.remove(req.body.email);
        res.status(200).json({ok:true})
    }
    catch(err){
        console.log(err);
        res.status(500).json({ok:false})
    }
}


const handlePost = async (req, res, organizationId) => {
  const {name, email} = req.body;
    try {
      const sender = await SenderRepository.add(organizationId, name, email);
      await MailService.verifyEmailIdentity(req.body.email);
    
        res.status(200).json({ ok: true });
      } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false });
      }
}

const handler = async (req, res) => {

  console.log("Got Request", req.method, req.body)

  if (req.method != 'POST' && req.method != 'DELETE') {
    res.status(405).json({});
    return
  }

  const session = await getServerSession(req, res, authOptions);
  const organizationId = await UserRepository.getOrganizationIdByEmail(session.user.email);

  if (req.method == 'DELETE') {
    await handleDelete(req, res, organizationId);
    return
  }

  if (req.method == 'POST') {
    await handlePost(req, res, organizationId);
    return;
  }

  console.log("WTF")
  res.status(500).json({})
};

export default handler;
