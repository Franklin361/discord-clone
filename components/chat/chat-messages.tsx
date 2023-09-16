"use client";

import { format } from 'date-fns'
import { Member, Message, Profile } from '@prisma/client';
import { ChatWelcome } from './chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';
import { Fragment } from 'react';
import { ChatItem } from './chat-item';
import { MessageWithMemberWithProfile } from '@/types';
import { useChatSocket } from '@/hooks/use-chat-socket';

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

const DATE_FORMAT = 'd MMM yyyy, HH:mm'

export const ChatMessages = (props: Props) => {

  const queryKey = `chat:${props.chatId}`
  const addKey = `chat:${props.chatId}:messages`
  const updateKey = `chat:${props.chatId}:messages:update`

  const chatQuery = useChatQuery({
    apiUrl: props.apiUrl,
    paramKey: props.paramKey,
    paramValue: props.paramValue,
    queryKey
  })

  useChatSocket({
    addKey,
    updateKey,
    queryKey,
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
                    content={msg.content}
                    currentMember={props.member}
                    deleted={msg.deleted}
                    fileUrl={msg.fileUrl}
                    id={msg.id}
                    isUpdated={msg.createdAt !== msg.updatedAt}
                    member={msg.member}
                    socketQuery={props.socketQuery}
                    socketUrl={props.socketUrl}
                    timestamp={format(new Date(msg.createdAt), DATE_FORMAT)}
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