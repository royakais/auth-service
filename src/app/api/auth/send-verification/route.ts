import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    generateVerificationToken,
    sendVerificationEmail,
} from "@/lib/email";

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, number>();

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Rate limiting: 1 request per minute
        const lastRequest = rateLimitMap.get(session.user.email);
        const now = Date.now();

        if (lastRequest && now - lastRequest < 60000) {
            return NextResponse.json(
                {
                    error:
                        "Please wait before requesting another verification email",
                },
                { status: 429 }
            );
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if already verified
        if (user.emailVerified) {
            return NextResponse.json(
                { message: "Email is already verified" },
                { status: 200 }
            );
        }

        // Generate new verification token
        const verificationToken = generateVerificationToken();
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Update user with new token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken,
                verificationTokenExpiry,
            },
        });

        // Send verification email
        const result = await sendVerificationEmail(user.email, verificationToken);

        if (!result.success) {
            return NextResponse.json(
                { error: "Failed to send verification email" },
                { status: 500 }
            );
        }

        // Update rate limit
        rateLimitMap.set(session.user.email, now);

        return NextResponse.json(
            { message: "Verification email sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Send verification email error:", error);
        return NextResponse.json(
            { error: "An error occurred" },
            { status: 500 }
        );
    }
}
