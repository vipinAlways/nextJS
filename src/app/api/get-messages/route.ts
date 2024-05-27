import { getServerSession } from "next-auth"; //this requires auth options
import { authOptions } from "../auth/[...nextauth]/options";
import usermodel from "@/Models/User.model";
import dbConnect from "@/lib/dbconnect";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req:Request) {
    await dbConnect()
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
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user =await usermodel.aggregate([
            {
                $match:{id:userId}
            },{
                $unwind:'message'
            },
            {$sort:{'message.createdAt':-1}},
            {$group:{_id:"$_id", message:{$push:'$message'}} }


        ])

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "user not found",
              },{status:401});
        }
        return Response.json({
            success: true,
            messages: user[0].message,
          },{status:200});
    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "failed to get messages",
          },{status:500});
    }
    
}