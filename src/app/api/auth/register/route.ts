import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { generateVerificationToken, sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { error: "Valid email is required." },
      { status: 400 }
    );
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);

  // Create verification token
  const verificationToken = generateVerificationToken();
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        verificationToken,
        verificationTokenExpiry,
      },
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken);

    if (!emailResult.success) {
      console.error("Verification email failed to send:", emailResult.error);
    }

    return NextResponse.json(
      {
        message: emailResult.success
          ? "User registered successfully. Please check your email to verify your account."
          : "User registered successfully, but there was an issue sending the verification email. Please contact support.",
        userId: user.id,
        emailSent: emailResult.success
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 409 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error?.message || "Something went wrong during registration." },
      { status: 500 }
    );
  }
}

