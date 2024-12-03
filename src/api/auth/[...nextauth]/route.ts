import NextAuth, { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
            return null;
          }
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_CALOG_API_URL}/api/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(credentials),
            });
  
            const user = await response.json();
            const  accessToken = response.headers.get('Authorization') || '';
            
            if (response.ok && response.status === 200) {
              return {
                id: user.user.id,
                email: user.user.email,
                accessToken: accessToken,
              };
            }
            return null;
          } catch (err) {
            console.error('로그인 에러:', err);
            return null;
          }
      }
    }),
    CredentialsProvider({
      id: 'oauth',
      name: 'OAuth',
      credentials: {},
      async authorize() {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_CALOG_API_URL}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            return {
              id: data.user.id,
              email: data.user.email,
              accessToken: data.accessToken,
            };
          }
          return null;
        } catch (err) {
          console.error('OAuth 로그인 에러:', err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id as number;
      session.user.email = token.email as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };