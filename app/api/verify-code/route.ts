import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();

        // Validate the code using verifySchema
        const result = verifySchema.safeParse({ code });

        if (!result.success) {
            return Response.json(
                {
                    success: false,
                    message: result.error.errors[0].message
                },
                { status: 400 }
            );
        }

        const decodedUsername = decodeURIComponent(username);
        const existingUser = await UserModel.findOne({ username: decodedUsername });

        if (!existingUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            );
        }

        const isVerifyCodeValid = existingUser.verifyCode === code;
        const isCodeNotExpired = new Date(existingUser.verifyCodeExpiry) > new Date();

        if (isVerifyCodeValid && isCodeNotExpired) {
            existingUser.isVerified = true;
            await existingUser.save();
            return Response.json(
                {
                    success: true,
                    message: "Verification successfully"
                },
                { status: 200 }
            );
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired; please sign up again to verify your account"
                },
                { status: 400 }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Invalid verification code"
                },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("Error in verification code process", error);
        return Response.json(
            {
                success: false,
                message: "Error in verification process"
            },
            { status: 500 }
        );
    }
}
