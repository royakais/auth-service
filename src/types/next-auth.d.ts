import "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        emailVerified: Date | null;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            emailVerified: Date | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user?: {
            id: string;
            email: string;
            emailVerified: Date | null;
        };
    }
}
