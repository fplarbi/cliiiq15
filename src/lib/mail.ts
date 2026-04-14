import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, Token: string) {
    const link = `http://localhost:3000/verify-email?token=${Token}`;

    resend.emails.send({
        from: 'Cliiiq@resend.dev',
        to: email,
        subject: 'Verify your email',
        html: 
        `
        <h1>Welcome to Cliiiq!, Kindly verify your email</h1>
        <p>Click the link below to verify your email address</p>
        <a href="${link}">Verify Email</a>
        `
    });
}

export async function sendPasswordResetEmail(email: string, Token: string) {
    const link = `http://localhost:3000/reset-password?token=${Token}`;

    resend.emails.send({
        from: 'Cliiiq@resend.dev',
        to: email,
        subject: 'Reset your password',
        html: 
        `
        <h1>You have requested to reset your password</h1>
        <p>Click the link below to reset password</p>
        <a href="${link}">Reset Password</a>
        `
    });
}

  