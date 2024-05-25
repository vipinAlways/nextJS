import { z } from "zod";

export const MessageSchema =z.object({
    content:z.string().min(10,{message:'content should be atleat 10 characters'}).max(300,"content cna't not be more than 300 characters")
})
