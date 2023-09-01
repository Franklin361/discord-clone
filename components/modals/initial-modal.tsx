"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from 'react';

const schema = z.object({
  name: z.string().min(1, { message: 'Server name is required!' }),
  imageUrl: z.string().min(1, { message: 'Server image is required!' }),
});

type Form = z.infer<typeof schema>;

const InitialModal = () => {

  // hydratation erros fix 
  const [isMounted, setisMounted] = useState(false)

  useEffect(() => {
    setisMounted(true)
  }, [])


  const form = useForm<Form>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      name: '',
      imageUrl: ''
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: Form) => {
    console.log(values)
  }

  if (!isMounted) return null

  return (
    <>
      <Dialog>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className='pt-8 px-6'>
            <DialogTitle className='text-2xl text-center font-bold'>Customize your server</DialogTitle>
            <DialogDescription className='text-center text-zinc-500'>
              Give your server a personality with a name and an image. You can always change it later.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-8'
            >
              <div className='space-y-8 px-6'>
                <div className='flex justify-center items-center'>
                  IMAGE UPLOAD
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>Server name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                          placeholder='Enter server name'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className='bg-gray-100 px-6 py-4'>
                <Button variant='primary' disabled={isLoading} type="submit">Create</Button>
              </DialogFooter>

            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default InitialModal