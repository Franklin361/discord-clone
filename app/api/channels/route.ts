import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'


export async function POST( 
  req: NextRequest
)  {
   try {
    
    const { name, type } = await req.json()

    const current_profile = await currentProfile()

    const { searchParams} = new URL(req.url)
    const serverId = searchParams.get('serverId')

    if(!current_profile) return new NextResponse('Unauthorized',{ status: 401 });
    if(!serverId) return new NextResponse('Server ID Missing', { status: 400 })
    if(name === 'general') return new NextResponse('Name cannot be general', { status: 400 })


     const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: current_profile.id,
            role:{
              in:[MemberRole.MODERATOR, MemberRole.ADMIN]
            }
          }
        }
      },
      data: {
        channels: {
          create: {
            profileId: current_profile.id,
            name,
            type
          }
        }
      }
     })

     return NextResponse.json(server)
   } catch (error) {
    console.log(error)
    return new NextResponse('Internal Server',{ status: 500 })
   }
}