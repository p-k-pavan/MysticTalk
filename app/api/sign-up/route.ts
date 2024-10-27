import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

interface RegisterUserProps {
    username: string;
    email: string;
    password: string;
}

export async function POST(request: Request) {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    try {
        await dbConnect();

        const { username, email, password }: RegisterUserProps = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                { success: false, message: "Username is already taken" },
                { status: 400 }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        let verifyCode: string;

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return new Response(
                    JSON.stringify({ success: false, message: "Email is already verified." }),
                    { status: 500 }
                );
            } else {
                const salt = genSaltSync(10);
                const hash = hashSync(password, salt);

                existingUserByEmail.password = hash;
                verifyCode = generateVerificationCode();
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = expiryDate;

                await existingUserByEmail.save();
            }
        } else {
            const salt = genSaltSync(10);
            const hash = hashSync(password, salt);

            verifyCode = generateVerificationCode();
            const newUser = new UserModel({
                username,
                email,
                password: hash,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });

            await newUser.save();
        }    

        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return new Response(
                JSON.stringify({ success: false, message: emailResponse.message }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: "User registered successfully and verification email sent" }),
            { status: 201 }
        );
        
    } catch (error) {
        console.error("Error during registration:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Internal server error" }),
            { status: 500 }
        );
    }
}

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
