'use client';

import { MessageWithMemberWithProfile } from '@/types';
import { Member, MemberRole, Profile } from '@prisma/client';
import { UserAvatar } from '../user-avatar';
import ActionTooltip from '../action-tooltip';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import qs from 'query-string';
import axios from 'axios';
import { useModal } from '@/hooks/use-modal-store';
import { useParams, useRouter } from 'next/navigation';


interface Props {
  id: string
  content: string
  member: Member & { profile: Profile }
  timestamp: string
  fileUrl: string | null
  deleted: boolean
  currentMember: Member
  isUpdated: boolean
  socketUrl: string
  socketQuery: Record<string, string>
}

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className='ml-2 h-4 w-4 text-rose-500' />,
  [MemberRole.MODERATOR]: <ShieldCheck className='ml-2 h-4 w-4 text-indigo-500' />,
  [MemberRole.GUEST]: null
}

const formSchema = z.object({
  content: z.string().min(1)
})

type FormType = z.infer<typeof formSchema>

export const ChatItem = (props: Props) => {

  const { member, currentMember, socketQuery, socketUrl, ...msg } = props

  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { onOpen } = useModal()

  const form = useForm<FormType>({
    defaultValues: { content: msg.content },
    resolver: zodResolver(formSchema as any)
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: FormType) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${msg.id}`,
        query: socketQuery
      })

      await axios.patch(url, values)
      form.reset()
      setIsEditing(false)

    } catch (error) {
      console.log((error as Error).message)
      console.log(error)
    }
  }

  const onMemberClick = () => {
    if (member.id === currentMember.id) return
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  useEffect(() => {
    form.reset({
      content: msg.content
    })
  }, [msg.content, form])

  useEffect(() => {

    const listener = (e: any) => (e.key === 'Escape' || e.keyCode === 27) && setIsEditing(false)

    window.addEventListener('keydown', listener)

    return () => window.removeEventListener('keydown', listener)

  }, [])

  const fileType = msg.fileUrl?.split('.').pop()
  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = currentMember.role === MemberRole.MODERATOR
  const isOwner = currentMember.id === member.id
  const canDeleteMessage = !msg.deleted && (isAdmin || isModerator || isOwner)
  const canEditMessage = !msg.deleted && isOwner && !msg.fileUrl
  const isPdf = msg.fileUrl && fileType === 'pdf'
  const isImage = msg.fileUrl && !isPdf
  return (
    <div className='relative group flex items-center hover:bg-black/5 p-4 transition w-full'>
      <div className='group flex gap-x-2 items-start w-full'>
        <div
          className='cursor-pointer hover:drop-shadow-md transition'
          onClick={onMemberClick}
        >
          <UserAvatar
            src={member.profile.imageUrl}
          />
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex items-center gap-x-2'>
            <div className='flex items-center '>
              <p
                className='font-semibold text-sm hover:underline cursor-pointer'
              >{member.profile.name}</p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className='text-sm text-zinc-500 dark:text-zinc-400'>
              {msg.timestamp}
            </span>
          </div>
          {
            isImage && (
              <a
                href={msg.fileUrl!}
                target='_blank'
                rel='noopener noreferrer'
                className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'
              >
                <Image
                  alt={msg.content}
                  src={msg.fileUrl!}
                  fill
                  className='object-cover'
                />
              </a>
            )
          }
          {
            isPdf && (
              <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
                <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400 ' />
                <a
                  href={msg.fileUrl!}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
                >
                  {msg.fileUrl!}
                </a>
              </div>
            )
          }
          {
            !msg.fileUrl && !isEditing && (
              <p className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                msg.deleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
              )}>
                {msg.content}
                {msg.isUpdated && !msg.deleted && (
                  <span className='text-[10px] mx-2 text-zinc-500 dark:text-zinc-400'>(edited)</span>
                )}
              </p>
            )
          }

          {
            !msg.fileUrl && isEditing && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='flex items-center w-full gap-x-2 pt-2'
                >
                  <FormField
                    control={form.control}
                    name='content'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormControl>
                          <div className="relative w-full ">
                            <Input
                              {...field}
                              placeholder='Edit your message'
                              className='p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button disabled={isLoading} size='sm' variant='primary'>Save</Button>
                </form>
                <span className='text-[10px] mt-1 text-zinc-400'>
                  Press escape to cancel, enter to save
                </span>
              </Form>
            )
          }
        </div>
      </div>

      {canDeleteMessage && (
        <div className='hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 rounded-sm border'>
          {canEditMessage && (
            <ActionTooltip label='Edit'>
              <Edit
                onClick={() => setIsEditing(true)}
                className='cursor-pointer ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
              />
            </ActionTooltip>
          )}
          <ActionTooltip label='Delete'>
            <Trash
              onClick={() => onOpen('delete-message', {
                apiUrl: `${socketUrl}/${msg.id}`,
                query: socketQuery
              })}
              className='cursor-pointer ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
} 