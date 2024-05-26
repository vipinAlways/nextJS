import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbconnect";
import usermodel from "@/Models/User.model";


export const authOptions: NextAuthOptions = {
  providers: [//ye sabh kcuhh providers main vapis ja rha hain 
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" }, //bts ek form banega humare liye
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
         const user= await usermodel.findOne({
            $or: [
                {
                    email:credentials.indentifier
                },{userName:credentials.indentifier}
            ],
          });
          if (!user) {
            throw new Error("no user found throw this email || userName")
          }
          if(!user.isVerified){
            throw new Error("please verify your accout first")

          }
          const ispassword=await bcrypt.compare(credentials.password,user.password)
          if (ispassword) {
            return user
          }else{
            throw new Error("inccorect password")
          }


        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  pages:{
    signIn:"/sign_in"
  }
};
