import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectToDatabase from "./lib/db";
import User from "./models/user.model";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { type: "text", placeholder: "username" },
        email: { type: "email", placeholder: "email" },
        password: { type: "password", placeholder: "password" },
      },
      authorize: async (credentials) => {
        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        if(credentials.username !== user.username) {
          return null;
        }

        const isMatched = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isMatched) {
          return null;
        }

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role;
      session.user.username = token.username;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt", // required to use JWT sessions
    maxAge: 60 * 60, // 1 hour in seconds
  },

  jwt: {
    maxAge: 60 * 60, // 1 hour in seconds
  },
});
