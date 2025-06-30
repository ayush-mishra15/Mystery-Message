import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/options'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { User } from 'next-auth'
import { NextResponse } from 'next/server'


export async function POST(_request: Request) {
  void _request; // suppress unused param warning
  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    )
  }

  const user = session.user as User & { _id: string }

  const body: { acceptMessages: boolean } = await _request.json()
  const { acceptMessages } = body

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        updatedUser,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating message acceptance status:', error)
    return NextResponse.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    )
  }

  const user = session.user as User & { _id: string }

  try {
    const foundUser = await UserModel.findById(user._id)

    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error retrieving message acceptance status:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error retrieving message acceptance status',
      },
      { status: 500 }
    )
  }
}
