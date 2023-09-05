import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { ChanelType } from '@prisma/client'
import { redirect } from 'next/navigation'
import { ServerHeader } from './server-header'

interface Props {
  serverId: string
}

export const ServerSidebar = async ({ serverId }: Props) => {

  const current_profile = await currentProfile()

  if (!current_profile) return redirectToSignIn()

  const server = await db.server.findUnique({
    where: {
      id: serverId
    },
    include: {
      chanels: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: 'asc'
        }
      }
    }
  })

  const textChannels = server?.chanels.filter(channel => channel.type === ChanelType.TEXT)
  const audioChannels = server?.chanels.filter(channel => channel.type === ChanelType.AUDIO)
  const videoChannels = server?.chanels.filter(channel => channel.type === ChanelType.VIDEO)

  const members = server?.members.filter(member => member.profileId !== current_profile.id)

  if (!server) return redirect('/')

  const role = server.members.find(member => member.profileId === current_profile.id)?.role

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#f2f3f5]'>
      <ServerHeader
        server={server}
        role={role}
      />
    </div>
  )
}



