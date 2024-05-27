import { getServerSession } from "next-auth"; //this requires auth options
import { authOptions } from "../auth/[...nextauth]/options";
import usermodel from "@/Models/User.model";
import dbConnect from "@/lib/dbconnect";
import { User } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not Authenticated",
      },
      { status: 401 }
    );
  }
  const user = session?.user;
  const userId = user._id;
  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await usermodel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accepting message",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: " update user status to accepting message",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "user is not able accepting messages");
    return Response.json(
      {
        success: false,
        message: "user is not able accepting messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not Authenticated",
      },
      { status: 401 }
    );
  }
  const user:User = session?.user as User;
  const userId = user._id
 try {
     const foundUSer =await usermodel.findById(userId)
     if (!foundUSer) {
       return Response.json({
           success: false,
           message: "failed to found the user",
         },{status:404});
     }
     return Response.json({
       success: true,
       isAcceptingMessages :foundUSer.isAcceptingMessages
     },{status:200});
 } catch (error) {
    console.log("error in finding user",error);
    return Response.json({
        success: false,
        message: "error in finding user",
      },{status:500});
 }
}
