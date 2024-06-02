import { getServerSession } from "next-auth"; //this requires auth options
import { authOptions } from "../auth/[...nextauth]/options";
import usermodel from "@/Models/User.model";
import dbConnect from "@/lib/dbconnect";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req:Request) {
    await dbConnect()
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if (!session || !session.user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Not authenticated",
        }),
        { status: 401 }
      );
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user =await usermodel.aggregate([
            {
                $match:{_id:userId}
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
           
            messages: user[0].message
          },{status:200});
    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "failed to get messages",
          },{status:500});
    }
    
}