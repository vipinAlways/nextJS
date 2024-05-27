import usermodel from "@/Models/User.model";
import dbConnect from "@/lib/dbconnect";



export async function POST(req:Request) {
    await dbConnect()

    try {
        const {uesrName,code}=await req.json()

        const decodedUserName=decodeURIComponent(uesrName)
        const user =await usermodel.findOne({userName:decodedUserName})
        if (!user) {
            return Response.json({
                success:false,
                message:"user not found"
            },{status:400})
        }

        const isCodeValid=user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCode) > new  Date()
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified =true
            await user.save()
            return Response.json({
                success:true,
                message:"Account verified successfully"
            },{status:200})
        }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"verify code is expire please sign-up again"
            },{status:400})
        }
        return Response.json({
            success:false,
            message:"Incorrect verification code"
        },{status:400})
    } catch (error) {
        console.log("error in verifying user",error);
        return Response.json({
            success:false,
            message:"Error in verifing vreify-code"
        },{status:500})
    }
}