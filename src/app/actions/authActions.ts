'use server';


import { auth, signIn, signOut } from "@/auth";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/schemas/loginSchema";
import { combinedRegisterSchema, ProfileSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { generateToken, getTokenByToken } from "@/lib/token";
import { ActionResult } from "@/types";
import { TokenType, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { th } from "zod/locales";


export async function signInUser(data: LoginSchema): Promise<ActionResult<string>> {
    try {

        const existingUser = await getUserByEmail(data.email);

        if (!existingUser || !existingUser.email) return { status: "error", error: "Invalid credentials" };

        if (!existingUser || !existingUser.emailVerified) {
            const token = await generateToken(existingUser.email, TokenType.VERIFICATION);

            await sendVerificationEmail(token.email, token.token);

            return { status: "error", error: "Email not verified. A new verification email has been sent." };
        }


        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        console.log(result);

        return { status: 'success', data: 'logged in successfully' };
    } catch (error) {
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

export async function registerUser(data: RegisterSchema): Promise<ActionResult<User>> {
    try {

        const validated = combinedRegisterSchema.safeParse(data);

        if (!validated.success) {
            return { status: 'error', error: validated.error.message };
        }

        const { name, email, password, gender, description, city, country, dateOfBirth } = validated.data;

        const hashPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) return { status: 'error', error: "User already exists" };

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashPassword,
                profileComplete: true,
                member: {
                    create: {
                        name,
                        description,
                        city,
                        country,
                        dateOfBirth: new Date(dateOfBirth),
                        gender
                    }
                }

            }
        });

        const verificationToken = await generateToken(email, TokenType.VERIFICATION);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { status: 'success', data: user }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'registration error' }
    }
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

    if (!userId) throw new Error('Unathorised')

    return userId;
}

export async function verifyEmail(token: string): Promise<ActionResult<string>> {
    try {
        const existingToken = await getTokenByToken(token);

        if (!existingToken) {
            return { status: "error", error: "Invalid token" }
        }

        const hasExpired = new Date() > existingToken.expires;

        if (hasExpired) {

            return { status: "error", error: "Token has expired " }
        }

        const existingUser = await getUserByEmail(existingToken.email);

        if (!existingUser) {
            return { status: "error", error: "User not found" }
        }

        await prisma.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: new Date() }
        });

        await prisma.token.delete({
            where: { id: existingToken.id }
        })

        return { status: "success", data: "Email verified successfully" };

    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function generateResetPasswordEmail(email: string): Promise<ActionResult<string>> {
    try {
        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return { status: "error", error: "User not found" }
        }

        const token = await generateToken(email, TokenType.PASSWORD_RESET);
        await sendPasswordResetEmail(token.email, token.token);
        return { status: "success", data: "Password reset email sent" }

    } catch (error) {
        console.error(error);
        return { status: "error", error: "An error occurred while generating password reset email" }
    }
}

export async function resetPassword(Password: string, token: string | null): Promise<ActionResult<string>> {
    try {

        if (!token) { return { status: "error", error: "Invalid token" }; }

        const existingToken = await getTokenByToken(token);
        if (!existingToken) {
            return { status: "error", error: "Invalid token" }
        }

        const hasExpired = new Date() > existingToken.expires;

        if (hasExpired) {

            return { status: "error", error: "Token has expired " }
        }

        const existingUser = await getUserByEmail(existingToken.email);

        if (!existingUser) {
            return { status: "error", error: "User not found" }
        }

        const hashPassword = await bcrypt.hash(Password, 10);

        await prisma.user.update({
            where: { id: existingUser.id },
            data: { passwordHash: hashPassword }
        });

        await prisma.token.delete({
            where: { id: existingToken.id }
        })

        return { status: "success", data: "Password reset successfully" };

    } catch (error) {
        console.error(error);
        return { status: "error", error: "An error occurred while resetting password" }
    }
}

export async function completeSocialLoginProfile(data: ProfileSchema):
    Promise<ActionResult<string>> {

    const session = await auth();

    if (!session?.user) {
        return { status: "error", error: "User not found" };
    }

    try {
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                profileComplete: true,
                member: {
                    create: {
                        name: session.user.name as string,
                        image: session.user.image,
                        gender: data.gender,
                        dateOfBirth: new Date(data.dateOfBirth),
                        description: data.description,
                        city: data.city,
                        country: data.country,

                    }
                }
            },
            select: {
                accounts: {
                    select: {
                        provider: true
                    }

                }
            }
        });
        return { status: "success", data: user.accounts[0].provider };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getUserRole() {
    const session = await auth();

    const role = session?.user.role;

    if (!role) throw new Error("User role not found");

    return role;

}