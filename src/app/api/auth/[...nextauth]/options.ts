import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { Document } from 'mongoose';
import { User as NextAuthUser } from 'next-auth';

interface UserDoc extends Document {
  _id: string;
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
}

// 👇 We now include _id in AuthorizedUser because your app expects it
interface AuthorizedUser extends NextAuthUser {
  id: string;
  _id: string;
  email: string;
  username: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<AuthorizedUser | null> {
        if (!credentials?.identifier || !credentials.password) return null;

        await dbConnect();

        const userDoc = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        }) as UserDoc | null;

        if (!userDoc) throw new Error('No user found with this email or username');
        if (!userDoc.isVerified) throw new Error('Please verify your account before logging in');

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          userDoc.password
        );

        if (!isPasswordCorrect) throw new Error('Incorrect password');

        return {
          id: userDoc._id.toString(),
          _id: userDoc._id.toString(), // ✅ Fix added here
          email: userDoc.email,
          username: userDoc.username,
          isVerified: userDoc.isVerified,
          isAcceptingMessages: userDoc.isAcceptingMessages,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          _id: (user as AuthorizedUser)._id,
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
          isAcceptingMessages: user.isAcceptingMessages,
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
      }
      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/sign-in',
  },
};