"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Plus, Smile } from 'lucide-react';
import { Input } from '../ui/input';
import axios from 'axios';
import qs from 'query-string';
import { useModal } from '@/hooks/use-modal-store';
import { EmojiPicker } from '../emoji-picker';
import { useRouter } from 'next/navigation';

interface Props {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: 'conversation' | 'channel'
}

const formSchema = z.object({
  content: z.string().min(1)
})

type FormType = z.infer<typeof formSchema>

export const ChatInput = ({
  apiUrl,
  name,
  query,
  type
}: Props) => {

  const { onOpen } = useModal()
  const router = useRouter()

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema as any),
    defaultValues: { content: '' }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: FormType) => {
    try {

      const url = qs.stringifyUrl({
        url: apiUrl,
        query
      })

      await axios.post(url, values)


      form.reset()
      form.setFocus('content')
      router.refresh()

    } catch (error) {
      console.log(error)
    }
  }

  const placeholder = `Write a messagge for ${type === 'conversation' ? name : '#' + name}`

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative p-4 pb-6'>
                  <button
                    type='button'
                    onClick={() => onOpen('message-file', { apiUrl, query })}
                    className='absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-400 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center'
                  >
                    <Plus className='text-white dark:text-[#313338]' />
                  </button>
                  <Input
                    placeholder={placeholder}
                    disabled={isLoading}
                    className='px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                    {...field}
                  />
                  <div className='absolute top-7 right-8'>
                    <EmojiPicker
                      onChange={(e: string) => field.onChange(`${field.value} ${e}`)}
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}


