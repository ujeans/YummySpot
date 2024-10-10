import NextAuth from "next-auth";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || "",
      clientSecret: process.env.NAVER_CLIENT_SECRET || "",
    }),
  ],
};

export default NextAuth(authOptions);
