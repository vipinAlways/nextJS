'use client'
import { useSession,signOut } from 'next-auth/react'
import Link from 'next/link'
import {User} from "next-auth"
import { Button } from './ui/button'
function Navbar() {
    const {data :session} = useSession()
    const user:User= session?.user as User//useSession work on client side not on server side 

  return (
    <nav className=' p-4 md:p-6 shadow-md'>
        <div className='container w-full bg-zinc-600 flex justify-between'>
            <a href="#">Mestry Message</a>
            {
                session?(
                   <>
                    <span className='mr-4'> Welcomde {user?.userName || user?.email}</span>
                    <Button className='w-full md:w-auto' onClick={()=>signOut()}>logout</Button></>
                ):(
                    <Link href="/sign-in"><Button className='w-full md:w-auto'>Sign In</Button></Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar