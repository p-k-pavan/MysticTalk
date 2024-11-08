import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation.nonempty("Username is required")
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username') || ''
        };

        const result = UsernameQuerySchema.safeParse(queryParam);

        if (!result.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: result.error.errors[0]?.message || 
                      "Invalid username"
                }),
                { status: 400, headers: { "Content-Type": "application/json" }}
            );
        }

        const { username } = result.data;
        const existingUser = await UserModel.findOne({ username, isVerified: true });

        if (existingUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username is already taken"
                }),
                { status: 400, headers: { "Content-Type": "application/json" }}
            );
        } else {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Username is available"
                }),
                { status: 200, headers: { "Content-Type": "application/json" }}
            );
        }

    } catch (error) {
        console.error("Error checking username", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error checking username"
            }),
            { status: 500, headers: { "Content-Type": "application/json" }}
        );
    }
}
