import { transformImageUrl } from '@/lib/util'
import { MessageDto } from '@/types'
import { Image } from '@heroui/image'
import Link from 'next/link'
import React from 'react'
import { toast } from 'react-toastify'

type Props = {
    image?: string | null;
    href: string;
    title: string;
    subtitle?: string;

}

export default function NotificatonToast({image, href, title, subtitle}: Props) {
  return (
    <Link href={href} className='flex items-center'>
        <div className='mr-2'>
            <Image 
                src={transformImageUrl(image) || '/images/user.png'}
                height={50}
                width={50}
                alt='sender image'
            />
        </div>
        <div className='flex grow flex-col justify-center'>
            <div className='font-semibold'>{title}</div>
            <div className='text-sm'>{subtitle || 'Click to view'}</div>
        </div>
    
    </Link>
  )
}

export const newMessageToast = (message: MessageDto) => {
    toast(
    <NotificatonToast 
    image={message.senderImage}
    href={`/members/${message.senderId}/chat`}
    title={`${message.senderName} has sent you a message`}  
    />
    )
}

export const newLikeToast = (name: string, image: string | null, userId: string) => {
    toast(
    <NotificatonToast 
    image={image}
    href={`/members/${userId}/profile`}
    title={`${name} has liked your profile`} 
    subtitle='Click here to view your profile'
    />
    )
}