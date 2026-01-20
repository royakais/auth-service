import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // 1. Rate Limit: 3 requests per hour per email to prevent spamming
        const { success } = await rateLimit(`forgot-password:${email}`, 3, 60 * 60 * 1000);
        if (!success) {
            return NextResponse.json({ error: "Too many requests. Try again in an hour." }, { status: 429 });
        }

        // 2. Find the user
        const user = await prisma.user.findUnique({ where: { email } });

        // Security Tip: Even if user doesn't exist, we return a 200 "Success" 
        // so attackers can't "fish" for which emails are registered.
        if (!user) {
            return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
        }

        // 3. Create a secure random token and expiry (1 hour)
        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 3600 * 1000);

        // 4. Save to Database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry,
            },
        });

        // 5. Send the Email
        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

        await sendEmail({
            to: email,
            subject: "Reset your password",
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the button below to set a new one. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 12px; color: #64748b;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
        });

        return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}