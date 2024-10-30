import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    
    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username });
        
        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found"
                }),
                { status: 404}
            );
        }

        if (!user.isAcceptingMessages) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not accepting any messages"
                }),
                { status: 403}
            );
        }

        const newMessage = {
            content,
            createdAt: new Date()
        };

        user.messages.push(newMessage as Message);
        await user.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: "Message added successfully",
                newMessage
            }),
            { status: 201}
        );

    } catch (error) {
        console.error("Error adding message:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal server error"
            }),
            { status: 500}
        );
    }
}
