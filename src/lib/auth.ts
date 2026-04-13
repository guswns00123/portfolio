import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      // ADMIN_GITHUB_ID에 등록된 GitHub 계정만 로그인 허용
      const adminId = process.env.ADMIN_GITHUB_ID;
      if (!adminId) return false;
      return profile?.login === adminId;
    },
  },
});
