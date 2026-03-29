import CardInnerWrapper from '@/components/CardInnerWrapper'
import React from 'react'
import ChatForm from './ChatForm'
import { getMessageThread } from '@/app/actions/messageActions'
import MessageList from './MessageList';
import { createChartId } from '@/lib/util';
import { getAuthUserId } from '@/app/actions/authActions';

export default async function ChatPage({params}: {params: Promise<{userId: string}>}) {
  const userId = await getAuthUserId(); //params;
  const messages = await getMessageThread((await params).userId);
  const chatId = createChartId(userId,  (await params).userId);

  return (
 <CardInnerWrapper 
    header = 'Chat'
    body = {
      <MessageList initialMessages={messages} curreentUserId={userId} chatId={chatId}/>
    }
    footer =  {<ChatForm />}
   />
  )
}
