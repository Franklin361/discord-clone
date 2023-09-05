import { ServerSidebar } from '@/components/server/server-sidebar'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function ServerIdLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: { serverId: string }
}) {

  const current_profile = await currentProfile()

  if (!current_profile) return redirectToSignIn()

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: current_profile.id
        }
      }
    }
  })

  if (!server) return redirect('/')

  return (
    <div className='h-full'>

      <div
        className='hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed'
      >
        <ServerSidebar serverId={params.serverId} />
      </div>

      <main className='h-full md:pl-60'>
        {children}
      </main>
    </div>
  )
}
