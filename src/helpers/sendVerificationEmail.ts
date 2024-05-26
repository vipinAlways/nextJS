import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
  email: string,
  userName: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification Code ",
      react: VerificationEmail({ userName, otp: verifyCode }),
    });

    return { success: true, message: "Verification Emailn send successfully" };
  } catch (error) {
    console.log("email verification error", error);
    return { success: false, message: "failed to send Verification" };
  }
}
