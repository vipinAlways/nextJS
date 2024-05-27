import usermodel from "@/Models/User.model";
import dbConnect from "@/lib/dbconnect";
import { userNameValidation } from "@/schemas/SignUpScheama";
import { z } from "zod";

const userNameQuerySchema = z.object({
  userName: userNameValidation,
});

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      userName: searchParams.get("userName"),
    };
    //validate with zod
    const result = userNameQuerySchema.safeParse(queryParam);
    console.log(result);
    if (!result.success) {
      const userNameError = result.error.format().userName?._errors || [];
      return Response.json(
        {
          success: false,
          message: "invalid character",
        },
        { status: 400 }
      );
    }

    const { userName } = result.data;

    const existingVerifiedUser = await usermodel.findOne({
      userName,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "user Name allready taken",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "user Name availeble",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error while checking userName", error);
    return Response.json({
      success: false,
      message: "error checking userName",
    });
  }
}
