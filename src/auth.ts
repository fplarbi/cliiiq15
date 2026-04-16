
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import NextAuth from "next-auth";
import { NextAuthConfig } from "next-auth";



export const { handlers: {GET, POST}, auth, signIn, signOut} = NextAuth({
  callbacks: {
    async jwt({user, token}) {
      if (user) {
        token.profileComplete = user.profileComplete;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) { 
     if (token?.sub && session?.user) {
      session.user.id = token.sub;
      session.user.profileComplete = token.profileComplete as boolean;
      session.user.role = token.role;
      }
      return session;
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
}as NextAuthConfig)