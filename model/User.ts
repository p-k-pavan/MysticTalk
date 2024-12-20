import mongoose, { Schema, Document, models } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
  _id?: string;
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified:boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: { 
    type: String, 
    required: [true, "Username is required"], 
    unique: true,
    trim:true, 
},
  email: { 
    type: String, 
    required: [true, "email is required"], 
    unique: true,
    match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Please enter a valid email address' 
      ]
},
  password: { 
    type: String, 
    required: [true, "Password is required"] 
},
  verifyCode: { 
    type: String,
    required: [true, "Verify code is required"]
},
  verifyCodeExpiry: { 
    type: Date,
    required: [true, "verifyCodeExpiry is required"]

 },
 isVerified: {
    type: Boolean,
    default: false
 },
  isAcceptingMessages: { 
    type: Boolean, 
    default: true 
},
  messages: [MessageSchema],
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)


                  
export default UserModel                 
