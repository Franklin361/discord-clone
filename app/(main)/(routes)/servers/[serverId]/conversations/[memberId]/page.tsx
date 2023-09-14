import { ChatHeader } from '@/components/chat/chat-header'
import { getOrCreateConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface Props {
  params: { memberId: string, serverId: string }
}


const ConversationPage = async ({ params }: Props) => {

  const profile = await currentProfile()

  if (!profile) return redirect('/')

  const currentMember = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId
    },
    include: {
      profile: true
    }
  })

  if (!currentMember) return redirect('/')

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId)

  if (!conversation) return redirect(`/servers/${params.serverId}`)

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        name={otherMember.profile.name}
        serverId={params.serverId}
        imageUrl={otherMember.profile.imageUrl}
        type='conversation'
      />
    </div>
  )
}
export default ConversationPage