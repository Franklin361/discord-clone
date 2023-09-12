import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH (
  req:NextRequest,
  { params }: { params: { channelId:string } }
) {
  try {

    const profile = await currentProfile()

    const { name, type } = await req.json()
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')

    if(!profile) return new NextResponse('Unauthorized', { status: 401 })

    if(!serverId) return new NextResponse('Server ID Missing', { status: 400 })
    
    if(!params.channelId) return new NextResponse('Channel ID Missing', { status: 400 })

    if(name === 'general') return new NextResponse('Name cannot be "general"', { status: 400 })

    const server = await db.server.update({
      where:{
        id: serverId,
        profileId: profile.id,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.MODERATOR, MemberRole.ADMIN]
            }
          }
        }
      },
      data: {
        channels:{
          update: {
            where:{
              id: params.channelId,
              NOT:{
                name: 'general'
              }
            },
            data: {
              name,
              type
            }
          }
        }
      }
    })

    return NextResponse.json({ server })

  } catch (error) {
    console.log(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  req:NextRequest,
  { params }: { params: { channelId:string } }
) {
  try {

    const profile = await currentProfile()

    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')

    if(!profile) return new NextResponse('Unauthorized', { status: 401 })

    if(!serverId) return new NextResponse('Server ID Missing', { status: 400 })

    if(!params.channelId) return new NextResponse('Channel ID Missing', { status: 400 })

    const server = await db.server.update({
      where:{
        id: serverId,
        profileId: profile.id,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.MODERATOR, MemberRole.ADMIN]
            }
          }
        }
      },
      data: {
        channels:{
          delete: {
            id: params.channelId,
            name: {
              not: 'general'
            }
          }
        }
      }
    })

    return NextResponse.json({ server })

  } catch (error) {
    console.log(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
