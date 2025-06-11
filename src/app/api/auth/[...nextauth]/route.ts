import NextAuth from "next-auth";
import TwitterProvider, { TwitterProfile } from "next-auth/providers/twitter";

const authOptions = {
  providers: [
    TwitterProvider({
      clientId: "cHUwRjV2Ykt0SllYMnFjZkV5TWw6MTpjaQ",
      clientSecret: "igHiIi4ZadfgglRSeypVNVJeTu867EWwddCmApXoHawYFrlHpT",
      version: "2.0",
      authorization: {
        params: {
          scope:
            "users.read tweet.read tweet.write follows.write offline.access",
        },
      },
      async profile(profile: TwitterProfile) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          image: profile.data.profile_image_url,
        };
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user, account }: any) => {
      if (account.provider === "twitter") {
        const { access_token } = account;
      }
      return true;
    },
    session: ({ session, token }: any) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        accessToken: token.accessToken,
      },
    }),
    async jwt({ token, user, account, profile, isNewUser }: any) {
      if (user) {
        token.id = user.id;
      }
      console.log(token);
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export {authOptions}
