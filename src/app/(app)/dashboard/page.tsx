'use client'

import { Message } from '@/Models/User.model'
import { useToast } from '@/components/ui/use-toast'
import { acceptMessageSchema } from '@/schemas/AcceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { Axios, AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'



function page() {
  const [messages,setMessages] =useState<Message[]>([])
  const [isLoading,setIsLoading] =useState<boolean>()
  const [isSwitchLoading,setIsSwitchLoading] = useState<boolean>()

  const {toast} = useToast()

  const handleDeleteMessage = (messageId:string) =>{
    setMessages(messages.filter((message)=> message._id !== messageId))
  }

  const {data:session} =useSession()
  const form =useForm({
    resolver:zodResolver(acceptMessageSchema)
  })

  const {register,watch,setValue} = form

  const acceptMessages = watch('accepyMessages')

  const fetchAccpetMessage = useCallback(async ()=> {
     setIsSwitchLoading(true)
    try {
      const response =await axios.get<ApiResponse>('/api/accept-messages')
      setValue('accepyMessages',response.data.isAcceptingMessage)
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description:axiosError.response?.data.message || "error in accepting message",
        variant:"destructive"
      })
    }finally{
      setIsSwitchLoading(false)
    }

  },[setValue])


  const fetchMessages = useCallback(async (refresh:boolean  = false)=>{
    setIsLoading(true)
    setIsSwitchLoading(false)
   try {
     const response = await axios.get<ApiResponse>('/api/get-messages')
     setMessages(response.data.messages || [])
     if (refresh) {
      toast({
        title:"error",
        description:'Showing latest messages'
      })
     }
   } catch (error) {
    const axiosError  =error as AxiosError<ApiResponse>
    toast({
      title:"error",
      description:'Showing latest messages',
      variant:"destructive"
    })
   }finally{
    setIsSwitchLoading(false)
    setIsLoading(false)
   }
  }, [setIsLoading,setMessages])

  useEffect(()=>{
    if (!session ||!session.user) {
      return
    }
    fetchMessages()
    fetchAccpetMessage()
  },[session,setValue,fetchAccpetMessage,fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const reponse =await axios.post<ApiResponse>("/api/accept-message",{
        acceptMessages:!acceptMessages
      })
      setValue('accepyMessages',!acceptMessages)
      toast({
        title:reponse.data.message,
        description:'Showing latest messages'
      })
    } catch (error) {
      const axiosError = error as AxiosError
      toast({
        title:"error",
        description:'Showing latest messages',
        variant:"destructive"
      })
    }
  }

    if(!session || !session.user){
      return <div>Please Login</div>
    }
    
  return (
    <div>dashboard</div>
  )
}

export default page