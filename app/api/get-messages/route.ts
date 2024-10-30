import { getServerSession, User } from "next-auth";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const userMessages = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);

        if (!userMessages || userMessages.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "No messages found"
                },
                { status: 404 }
            );
        } else {
            return Response.json(
                {
                    success: true,
                    messages: userMessages[0].messages
                },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Error getting messages:", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500 }
        );
    }
}