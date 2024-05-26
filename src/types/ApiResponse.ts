import {Message} from "@/Models/User.model"

export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessages?:boolean
    messages?:Array<Message>
}