import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { Document } from 'mongoose';

// Extend JWT and Session for custom fields
declare module 'next-auth' {
  interface Session {
    user: {
      _id: string;
      email: string;
      username: string;
      isVerified: boolean;
      isAcceptingMessages: boolean;
    };
  }

  interface User {
    _id: string;
    email: string;
    username: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id: string;
    email: string;
    username: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
  }
}

// Define expected credentials
interface Credentials {
  identifier: string;
  password: string;
}

// Mongoose User Type
interface UserDoc extends Document {
  _id: string;
  email: string;
  username: string;
  password: string;
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
      async authorize(credentials): Promise<any> {
        if (!credentials) return null;

        const { identifier, password } = credentials as Credentials;
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [{ email: identifier }, { username: identifier }],
          }) as unknown as UserDoc;

          if (!user) throw new Error('No user found with this email or username');
          if (!user.isVerified) throw new Error('Please verify your account before logging in');

          const isPasswordCorrect = await bcrypt.compare(password, user.password);
          if (!isPasswordCorrect) throw new Error('Incorrect password');

          return {
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            isVerified: user.isVerified,
            isAcceptingMessages: user.isAcceptingMessages,
          };
        } catch (err) {
          if (err instanceof Error) throw new Error(err.message);
          throw new Error('Unknown error during login');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
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
