import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { Account, NextAuthOptions, User as NextAuthUser } from 'next-auth';
import prisma from 'packages/emails/lib/prisma';
import MondayService from 'packages/emails/services/monday-service'
import OrganizationRepository from '../../../lib/repositories/organizations';
interface NextAuthUserWithStringId extends NextAuthUser {
  id: string;
}


const CLIENT_ID = "330353da306b82058036f937a3328a71"
const CLIENT_SECRET = "52f61876ae5bfcf9d2e6a4a05d168ab9"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
  debug: true,

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user,  account, profile, email, credentials }) {
      console.log('Signin', user, account);
      const exists = await OrganizationRepository.exists(account.providerAccountId);
      console.log('ORg exists?', exists);
      if (!exists) {
       const org = await OrganizationRepository.create(account.providerAccountId);
       console.log("Org created", org);
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log('!!#$$#$@#@@$#@#', url, baseUrl);
      return baseUrl;
    },
    async session(props: { session; user; token }) {
      console.log('session', props);
      return props.session;
    },
    async jwt(props: { token, user, account, profile, isNewUser }) {
        console.log("jwt", props)
      return props.token;
    },
  },
  // Configure one or more authentication providers
  providers: [
    {
      id: 'monday',
      name: 'Monday',
      type: 'oauth',

      clientId: CLIENT_ID,
      clientSecret: '52f61876ae5bfcf9d2e6a4a05d168ab9',
      authorization: {
        url: 'https://auth.monday.com/oauth2/authorize?client_id='+CLIENT_ID,
        params: {
          scope: 'users:read me:read account:read boards:read',
          redirect_uri:
            `${process.env.NEXTAUTH_URL}api/auth/callback/monday`,
        },
      },
      token: {
        url: 'https://auth.monday.com/oauth2/token',
        async request({ client, params, checks, provider }) {
          const response = await client.oauthCallback(
            provider.callbackUrl,
            params,
            checks,
            {
              exchangeBody: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
              },
            }
          );
          return {
            tokens: response,
          };
        },
      },
      userinfo: {
        request: async (token) => {
          return await MondayService.getCurrentUser(token.tokens.access_token);
        },
      },
      idToken: false,
      profile(profile) {
        console.log('Got profile', profile);
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email
        } as NextAuthUserWithStringId;
      },
    },
  ],
};

export default NextAuth(authOptions);


