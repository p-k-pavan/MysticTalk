import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compareSync } from "bcrypt-ts";
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"

export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                username: { label: "Email", type: "email", placeholder: "jodh@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect()
                try{
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error('No user found with this email')
                    }
                    if(!user.isVerified){
                        throw new Error('Please verify brfore login to your account or Sign up again to verify')
                    }
                    const isPassword = await compareSync(credentials.password,user.password);
                    if(isPassword){
                        return user
                    }else{
                        throw new Error('Incorrect Credential')
                    }
                }catch(err:any){
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user}) {
            if(user){
                token._id=user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
                
            }
            return token
        },
        async session({ session,token }) {
            if(token){
                session.user._id=token._id?.toString()
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    },
    secret:process.env.NEXTAUTH_SECRET_KEY,

}