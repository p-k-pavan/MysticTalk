import { getServerSession, User } from "next-auth";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401 }
        );
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user status to accept messages"
                },
                { status: 404 }
            );
        } else {
            return Response.json(
                {
                    success: true,
                    message: "Message acceptance status updated successfully",
                    updatedUser
                },
                { status: 200 }
            );
        }

    } catch (error) {
        console.error("Error updating message acceptance status:", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401 }
        );
    }

    const userId = user._id;

    try {
        const existingUser = await UserModel.findById(userId);

        if (!existingUser) {
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                { status: 404 }
            );
        } else {
            return Response.json(
                {
                    success: true,
                    message: "User data retrieved successfully",
                    isAcceptingMessages: existingUser.isAcceptingMessages
                },
                { status: 200 }
            );
        }

    } catch (error) {
        console.error("Error getting message acceptance status:", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500 }
        );
    }
}