import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "username alteast should be 2 characters")
  .max(20, "username can't more than 20 characters")
  .regex(
    /^[a-zA-Z0-9_ ]*$/,
    "username should not contain any special characters"
  );

export const signUpSchema = z.object({
    userName:userNameValidation,
    email:z.string({message:"invaild email address"}),
    password:z.string().min(8,{message:"password should be atleast 8 characters"})
});
