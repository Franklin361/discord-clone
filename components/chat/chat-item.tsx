'use client';

import { MessageWithMemberWithProfile } from '@/types';


interface Props extends MessageWithMemberWithProfile {

}

export const ChatItem = (msg: Props) => {
  return (
    <div>{msg.content}</div>
  )
}