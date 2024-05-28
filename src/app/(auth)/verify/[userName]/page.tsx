'use client'
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { VerifySchema } from "@/schemas/VerifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";


function verifiyAccount() {
  const router = useRouter();
  const param = useParams<{ userName: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {},
  });
  const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
    try {
      const reponse = await axios.post("/api/verify-code", {
        userName: param.userName,
        code: data.code,
      });
      toast({
        title: "Success",
        description: reponse.data.message,
      });

      router.replace("sign-in");
    } catch (error) {
      console.log("error in sign up of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "sign-up faild",
        description: axiosError.response?.data.message,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tighter lg:text-5xl mb-6">
            Verify your account 
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter Verification Code" {...field} />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </div>
      </div>
    </div>
  );
}

export default verifiyAccount;
