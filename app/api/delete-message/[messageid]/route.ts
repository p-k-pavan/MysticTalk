import { getServerSession, User } from "next-auth";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function DELETE(
    request: Request,
    { params }: { params: { messageid: string } }
) {
    const messageId = params.messageid;

    if (!messageId) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Message ID is required",
            }),
            { status: 400 }
        );
    }

    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Not Authenticated",
            }),
            { status: 401 }
        );
    }

    try {
        const response = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (response.modifiedCount === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Message not found or already deleted",
                }),
                { status: 400 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Message deleted successfully",
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting message:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal server error for deleting message",
            }),
            { status: 500 }
        );
    }
}
