import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Check if verified username already exists
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        // Update existing unverified user
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.username = username;
        existingUserByEmail.isVerified = true;
        existingUserByEmail.isAcceptingMessages = true;
        existingUserByEmail.messages = [];

        await existingUserByEmail.save();

        return Response.json(
          {
            success: true,
            message: "User registered successfully",
          },
          { status: 200 }
        );
      }
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        isVerified: true,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();

      return Response.json(
        {
          success: true,
          message: "User registered successfully",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error while registering user",
      },
      { status: 500 }
    );
  }
}