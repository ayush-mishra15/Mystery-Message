import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';
import { NextResponse } from 'next/server';

interface SessionUser extends User {
  _id: string;
}

// ✅ GET: fetch current user's message setting
export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const user = session.user as SessionUser;

  try {
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
      console.error(
        'Error fetching message setting:',
        error instanceof Error ? error.message : error
      );
      return NextResponse.json(
        { success: false, message: 'Error fetching message setting' },
        { status: 500 }
      );
}
}

// ✅ POST: update user's message setting
export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const user = session.user as SessionUser;
  const body: { acceptMessages: boolean } = await request.json();
  const { acceptMessages } = body;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { isAcceptingMessages: acceptMessages }, // ✅ correct spelling
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        updatedUser,
      },
      { status: 200 }
    );
    }catch (error: unknown) {
      console.error(
        'Error updating message acceptance status:',
        error instanceof Error ? error.message : error
      );
      return NextResponse.json(
        { success: false, message: 'Error updating message acceptance status' },
        { status: 500 }
      );
  }

}
