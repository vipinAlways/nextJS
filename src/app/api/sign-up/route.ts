import usermodel from "@/Models/User.model";
import dbConnect from "@/lib/dbconnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request) {
  await dbConnect();
  try {
    const { userName, password, email } = await request.json();

    const existingUserVerifiedByUserName = await usermodel.findOne({
      userName,
      isVerified: true,
    });
    if (existingUserVerifiedByUserName) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    const ExistingUserByEmail = await usermodel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (ExistingUserByEmail) {
        if (ExistingUserByEmail.isVerified) {
          return Response.json({
            success:false,
            message:"User with this email already exist"
        },{status:400})
        }
        else{
          const hasedPassword =await bcrypt.hash(password,10)
          ExistingUserByEmail.password=hasedPassword
          ExistingUserByEmail.verifyCode=verifyCode;
          ExistingUserByEmail.verifyCodeExpiry=new Date(Date.now() + 3600000)
          await ExistingUserByEmail.save()
        }

    } else {
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new usermodel({
        userName,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        message: [],
        email,
      });
      await newUser
      .save()
    }
    //send verification email
    const emailResponse= await sendVerificationEmail(
      email,userName,verifyCode
    )

    if (!emailResponse.success) {
      return Response.json({
          success:false,
          message:emailResponse.message
      },{status:500})
    }
    return Response.json({
      success:true,
      message:"user register successfully"
    },{status:200})
  } catch (error) {
    console.log("error on registering user", error);
    return Response.json(
      {
        success: false,
        message: "error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
