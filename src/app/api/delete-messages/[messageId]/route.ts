import { getServerSession } from "next-auth"; //this requires auth options
import { authOptions } from "../../auth/[...nextauth]/options";
import usermodel from "@/Models/User.model";
import dbConnect from "@/lib/dbconnect";
import { User } from "next-auth";


export async function DELETE({ params }: { params: { messageId: string } }) {
  const messageId = params.messageId;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not Authenticated",
      },
      { status: 401 }
    );
  }
  try {
   const updatedResult=  await usermodel.updateOne({
      _id: user._id
    },
    {$pull:{message:{_id:messageId}}}  
  );
  if (updatedResult.modifiedCount === 0) {
    return Response.json(
      {
        success:false,
        message:"message not found || already deletetd"
      },{status:404}
    )
  }
  return Response.json(
    {
      success:false,
      message:"message deletetd"
    },{status:200}
  )
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success:false,
        message:"message deletetd error"
      },{status:500}
    )
  }
}
