import CardInnerWrapper from '@/components/CardInnerWrapper'
import React from 'react'
import ChatForm from './ChatForm'
import { getMessageThread } from '@/app/actions/messageActions'
import MessageBox from './MessageBox';

export default async function ChatPage({params}: {params: Promise<{userId: string}>}) {
  const {userId} = await params;
  const messages = await getMessageThread(userId);
  

  const body = (
    <div>
      {messages.length === 0 ? 'No messages to display' : (
        <div>
            {messages.map(message => (
              <MessageBox key={message.id} message={message} currentUserId={userId}/>
            ))}
        </div>
      
      )}
    </div>
)

  return (
 <CardInnerWrapper 
    header = 'Chat'
    body = {body}
    footer =  {<ChatForm />}
   />
  )
}
