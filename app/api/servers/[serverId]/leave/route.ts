import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req:NextRequest,
  { params }: { params: { serverId:string } }
) {
  try {

    const profile = await currentProfile()

    if(!profile) return new NextResponse('Unauthorized', { status: 401 })

    if(!params.serverId) return new NextResponse('Server ID Missing', { status: 400 })

    const server = await db.server.update({
      where:{
        id: params.serverId,
        profileId: {
          not: profile.id
        },
        members: {
          some: {
            profileId: profile.id
          }
        }
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id
          }
        }
      }
    })
  
    const servers = await db.server.findMany({
      where: {
        members: {
          some: {
            profileId: profile.id
          }
        }
      }
    })

    const nextServer: string = servers.length !== 0 ?  `/servers/${servers[0].id}` : '/'

    return NextResponse.json({ nextServer })

  } catch (error) {
    console.log(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}