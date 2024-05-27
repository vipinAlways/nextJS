import usermodel from "@/Models/User.model";
import dbConnect from "@/lib/dbconnect";
import { Message } from "@/Models/User.model";


export async function POST(req: Request) {
  await dbConnect();

  const { userName, content } = await req.json();

  try {
    const user = await usermodel.findOne({ userName });
    if (!user) {
        return Response.json({
            success: false,
            message: "user not found",
          },{status:404});
    }
    //is acccpetinf the messages

    if (!user.isAcceptingMessages) {
        return Response.json({
            success: false,
            message: "user is not accepting message",
          },{status:401});
    }
    const newMessage ={content,createdAt:new Date()}
    user.message.push(newMessage as Message)
    await user.save()
    return Response.json({
        success: true,
        message: "message sent successfullt",
      },{status:401});
  } catch (error) {
    return Response.json({
        success: false,
        message: "failed on send messages",
      },{status:501});
  }
}
