import mongoose, { Schema, Document } from "mongoose";

// mongoose.connect(process.env.MOGODB_URI || "", {});

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  userName: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified:boolean,
  isAcceptingMessages: boolean;
  message: Message[];
}
const userSchema: Schema<User> = new Schema({
  userName: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "please use a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "password is required"],
  },
  verifyCodeExpiry:{
    type:Date,
    required:true
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  isAcceptingMessages:{
    type:Boolean,
    default:true
  },
  message:[MessageSchema]

});


const usermodel = (mongoose.models.User as mongoose.Model<User>)||mongoose.model<User>("User" , userSchema)

export default usermodel;