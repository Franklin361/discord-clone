import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { MediaRoom } from '@/components/media-room'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'

interface Props {
  params: { channelId: string, serverId: string }
}

const ChannelIdPage = async ({ params }: Props) => {

  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const { channelId, serverId } = params

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,

    }
  })

  const member = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId
    }
  })

  if (!channel || !member) return redirect('/')

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type='channel'
      />

      {channel.type === ChannelType.TEXT && (
        <>

          <ChatMessages
            apiUrl='/api/messages'
            chatId={channel.id}
            member={member}
            name={channel.name}
            paramKey='channelId'
            paramValue={channel.id}
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            socketUrl='/api/socket/messages'
            type='channel'
          />

          <ChatInput
            apiUrl='/api/socket/messages'
            name={channel.name}
            query={{
              channelId: channel.id,
              serverId: channel.serverId
            }}
            type='channel'
          />
        </>
      )}

      {
        channel.type === ChannelType.AUDIO && (
          <MediaRoom
            audio
            chatId={channel.id}
            video={false}
          />
        )
      }

      {
        channel.type === ChannelType.VIDEO && (
          <MediaRoom
            audio
            chatId={channel.id}
            video
          />
        )
      }

    </div>
  )
}
export default ChannelIdPage


















