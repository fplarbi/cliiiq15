import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { loginSchema } from "./lib/schemas/loginSchema"
import { getUserByEmail } from "./app/actions/authActions";
import { compare } from "bcryptjs";
 
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [Credentials({
    name: "Credentials",
    async authorize(creds) {
      const validated = loginSchema.safeParse(creds);
      if (validated.success) {
        const { email, password } = validated.data; 

        const user = await getUserByEmail(email);

        if (!user || !(await compare(password, user.passwordHash as string))) {
          return null;
        }
        return user;
      }
        return null; // Return null if authentication fails
      }

  })],
} satisfies NextAuthConfig