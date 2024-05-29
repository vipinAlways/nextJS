
"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useDebounceCallback} from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/SignUpScheama";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


const page = () => {
  const [userName, setuserName] = useState("");
  const [userNameMessage, setuserNameMessage] = useState("");
  const [isCheckinUSerName, setisCheckinUSerName] = useState(false);

  const [isSubmiting, setisSubmiting] = useState(false);

  const debounded = useDebounceCallback(value=> setuserName(value), 500);
  const {toast} = useToast();
  const router = useRouter();

  //zod impiltation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUserNameUniquness = async () => {
      if (userName) {
        setisCheckinUSerName(true);
        setuserNameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?userName=${userName}`
          );
          console.log(response);
         // let message =response.data.message
          setuserNameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setuserNameMessage(
            axiosError.response?.data.message ?? "error checking user name"
          );
        } finally {
          setisCheckinUSerName(false);
        }
      }
    };
    checkUserNameUniquness();
  }, [userName]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    console.log(data);
    setisSubmiting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${userName}`);
      setisSubmiting(false);
    } catch (error) {
      console.log("error in sign up of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "sign-up faild",
        description: "error in sign up of user",
      });
      setisSubmiting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tighter lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign Up to start your anonymous adventure</p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
              <FormField
                name="userName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your User Name" {...field} onChange={(e)=>{
                        field.onChange(e)
                        debounded(e.target.value)
                      }} />
                    </FormControl>
                    {isCheckinUSerName && <Loader2 className="animate-spin"/>}
                      <p className={`text-sm ${userNameMessage === "user Name availeble" ?'text-green-500':'text-red-400'  }` } >
                        test {userNameMessage}
                      </p>
                   <FormMessage />

                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Email" {...field} />
                    </FormControl>
                   <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your password" {...field} />
                    </FormControl>
                      
                   <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmiting}>
               {
                isSubmiting?(
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin">
                    please Wait
                  </Loader2>
                  </>
                ):('Sign-up')
               }
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4" >
            <p>
              Already a member ? {''}
              <Link href={"/sign-in"} className="text-blue-600 hover:text-blue-900"> 

              Sign-In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
