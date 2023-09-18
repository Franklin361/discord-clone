"use client";

import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
} from '@livekit/components-react';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

interface Props {
  chatId: string
  video: boolean
  audio: boolean
}

export const MediaRoom = ({ audio, chatId, video }: Props) => {
  const { user } = useUser()
  const [token, setToken] = useState('')

  useEffect(() => {

    if (!user?.firstName || !user?.lastName) return

    const name = `${user.firstName} ${user.lastName}`;


    (async () => {
      try {
        const resp = await fetch(
          `/api/liveKit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();

  }, [user?.firstName, user?.lastName, chatId])


  if (token === "") {
    return <div className='flex flex-col flex-1 justify-center items-center'>
      <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
      <p className='text-ms text-zinc-500 dark:text-zinc-400 '>Loading...</p>
    </div>;
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      connect={true}
      // connectOptions={{ autoSubscribe: false }}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
    >
      <VideoConference />
    </LiveKitRoom>
  )
}







