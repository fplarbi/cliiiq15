import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import { RiTokenSwapFill } from "react-icons/ri"
import { s } from "framer-motion/client"


export const { handlers: {GET, POST}, auth, signIn, signOut} = NextAuth({
  callbacks: {
    async session({ session, token }) { 
     if (token?.sub && session?.user) {
      session.user.id = token.sub;
      }
      return session;
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})