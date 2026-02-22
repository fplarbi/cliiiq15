'use server';


import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/schemas/loginSchema";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { ActionResult } from "@/types";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";


export async function signInUser(data: LoginSchema) : Promise<ActionResult<string>> {
    try {
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        console.log(result);

        return{status: 'success', data: 'logged in successfully'};
    }catch (error) {
        console.error(error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { status: "error", error: "Invalid email or password" };
                default:
                    return { status: "error", error: "An unknown error occurred during sign-in" };
            }
        } else {
            return { status: "error", error: "An unexpected error occurred" };
        }
    }
}


export async function signOutUser() {
        await signOut({ redirectTo: '/' });
}

export async function registerUser(data: RegisterSchema) {
    const validated = registerSchema.safeParse(data);

    if (!validated.success) {return {error: validated.error.message};}

    const { name, email, password } = validated.data;

    const hashPassword = await bcrypt.hash(password, 10);

     const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) return {error: "User already exists"};


    return prisma.user.create({
        data: {
            name,
            email,
            passwordHash: hashPassword
        }
    });
}

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email }
    });
}

export async function getUserById(id: string) {
    return prisma.user.findUnique({
        where: { id }
    });
}

export async function getAuthUserId() {

    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) throw new Error('Unathorised')

    return userId;
}