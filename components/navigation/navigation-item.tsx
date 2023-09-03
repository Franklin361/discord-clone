'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ActionTooltip } from '../action-tooltip';

interface Props {
  id: string
  imageUrl: string
  name: string
}

export const NavigationItem = ({ id, imageUrl, name }: Props) => {

  const params = useParams()
  const router = useRouter()

  const onClick = () => {
    router.push(`/servers/${id}`)
  }

  return (
    <ActionTooltip
      label={name}
      align='center'
      side='right'
    >
      <button
        onClick={onClick}
        className='group flex items-center relative'
      >
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
            params?.serverId !== id && 'group-hover:h-[20px]',
            params?.serverId === id ? 'h-[36px]' : 'h-[8px]',
          )}
        />

        <div
          className={cn(
            'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
            params?.serverId === id && 'bg-primary/10 text-primary rounded-[16px]'
          )}
        >
          <Image
            alt={name}
            fill
            className='object-cover'
            src={imageUrl}
          />
        </div>
      </button>
    </ActionTooltip>
  )
}