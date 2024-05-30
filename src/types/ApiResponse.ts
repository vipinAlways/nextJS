import {Message} from "@/Models/User.model"

export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptingMessage?:boolean
    messages?:Array<Message>
}