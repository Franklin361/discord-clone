import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'


export async function POST( req: NextRequest )  {
   try {
    
    const { name, imageUrl } = await req.json()

    const current_profile = await currentProfile()

     if(!current_profile){
      return new NextResponse('Unauthorized',{ status: 401 })
     }

     const server = await db.server.create({
      data:{
        profileId: current_profile.id,
        inviteCode: uuidv4(),
        imageUrl,
        name,
        chanels: {
          create: [
            { name: 'general', profileId: current_profile.id }
          ]
        },
        members: {
          create: [
            { profileId: current_profile.id, role: MemberRole.ADMIN }
          ]  
        }
      }
     })

     return NextResponse.json(server)
   } catch (error) {
    console.log(error)
    return new NextResponse('Internal Server',{ status: 500 })
   }
}