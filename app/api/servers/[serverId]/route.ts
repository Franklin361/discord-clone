import { v4 as  uuidv4} from 'uuid'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  req:NextRequest,
  { params }: { params: { serverId:string } }
) {
  try {

    const profile = await currentProfile()

    if(!profile) return new NextResponse('Unauthorized', { status: 401 })

    if(!params.serverId) return new NextResponse('Server ID Missing', { status: 400 })

    const server = await db.server.delete({
      where:{
        id: params.serverId,
        profileId: profile.id,
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


export async function PATCH(
  req:NextRequest,
  { params }: { params: { serverId:string } }
) {
  try {

    const profile = await currentProfile()
    const { imageUrl,name } = await req.json() 

    if(!profile) return new NextResponse('Unauthorized', { status: 401 })

    if(!params.serverId) return new NextResponse('Server ID Missing', { status: 400 })

    const server = await db.server.update({
      where:{
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        imageUrl,
        name
      }
    })

    return NextResponse.json(server)

  } catch (error) {
    console.log(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}