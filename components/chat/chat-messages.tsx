"use client";

import { Member, Message, Profile } from '@prisma/client';
import { ChatWelcome } from './chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';
import { Fragment } from 'react';
import { ChatItem } from './chat-item';
import { MessageWithMemberWithProfile } from '@/types';

interface Props {
  name: string
  member: Member
  chatId: string
  socketUrl: string
  apiUrl: string
  socketQuery: Record<string, any>
  paramValue: string
  paramKey: 'channelId' | 'conversarionId'
  type: 'channel' | 'conversarion'
}

export const ChatMessages = (props: Props) => {


  const queryKey = `chat:${props.chatId}`

  const chatQuery = useChatQuery({
    apiUrl: props.apiUrl,
    paramKey: props.paramKey,
    paramValue: props.paramValue,
    queryKey
  })

  if (chatQuery.status === 'loading') return (
    <div className='flex flex-col flex-1 justify-center items-center'>
      <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
      <p className='text-sm text-zinc-500 dark:text-zinc-400'>... Loading messages  </p>
    </div>
  )

  if (chatQuery.status === 'error') return (
    <div className='flex flex-col flex-1 justify-center items-center'>
      <ServerCrash className='h-7 w-7 text-zinc-500 my-4' />
      <p className='text-sm text-zinc-500 dark:text-zinc-400'>... Something went wrong! </p>
    </div>
  )

  return (
    <div className='flex-1 flex flex-col py-4 overflow-y-auto'>
      <div className='flex-1' />
      <ChatWelcome
        type={props.type}
        name={props.name}
      />

      <div className='flex flex-col-reverse mt-auto '>
        {
          chatQuery.data?.pages.map((group, i) => (
            <Fragment key={i}>
              {
                group.items.map((msg: MessageWithMemberWithProfile) => (
                  <ChatItem
                    key={msg.id}
                    {...msg}
                  />
                ))
              }
            </Fragment>
          ))
        }
      </div>

    </div>
  )
}