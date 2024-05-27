import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbconnect";
import usermodel from "@/Models/User.model";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" }, 
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
  callbacks:{
    async jwt({token,user}){
     if (user) {
      token._id =user._id?.toString()
      token.isVerified=user.isVerified
      token.isAcceptingMessages=user.isAcceptingMessages
      token.userName=user.userName
     }
     return token
    },
    async session({session,token}){
      if (token) {
        session.user.userName=token.userName
        session.user._id=token._id
        session.user.isAcceptingMessages=token.isAcceptingMessages
        session.user.isVerified=token.isVerified
      }
      return session
    }
  },
  pages:{
    signIn:"/sign-in"
  },
  session:{
    strategy:"jwt"
  },
  secret:process.env.NEXT_AUTH_SECRET

};
