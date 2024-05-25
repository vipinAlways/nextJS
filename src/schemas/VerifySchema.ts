import { z } from "zod";

export const VerifySchema =z.object({
    code:z.string().length(6,"Verfiaction code must be 6 digits")
})