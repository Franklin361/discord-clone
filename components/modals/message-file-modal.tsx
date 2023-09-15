"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import axios from 'axios';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { FileUpload } from '../file-upload';
import { useModal } from '@/hooks/use-modal-store';
import qs from 'query-string';

const schema = z.object({
  fileUrl: z.string().min(1, { message: 'Server image is required!' }),
});

type Form = z.infer<typeof schema>;

export const MessageFileModal = () => {

  const router = useRouter()
  const { type, isOpen, onClose, data } = useModal()

  const form = useForm<Form>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      fileUrl: ''
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: Form) => {
    try {
      const url = qs.stringifyUrl({
        url: data?.apiUrl || '',
        query: data?.query
      })

      await axios.post(url, { ...values, content: values.fileUrl });

      form.reset();
      router.refresh();
      handleClose()

    } catch (error) {
      console.log(error)
    }
  }

  const isModalOpen = isOpen && type === 'message-file'

  const handleClose = () => {
    onClose()
    form.reset()
  }

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleClose} >
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className='pt-8 px-6'>
            <DialogTitle className='text-2xl text-center font-bold'>Add an attachment</DialogTitle>
            <DialogDescription className='text-center text-zinc-500'>
              Send a file as a message
            </DialogDescription>
          </DialogHeader>

          <Form {...form} >
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-8'
            >
              <div className='space-y-8 px-6'>
                <div className='flex justify-center items-center'>
                  <FormField
                    control={form.control}
                    name='fileUrl'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint='messageFile'
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter className='bg-gray-100 px-6 py-4'>
                <Button variant='primary' disabled={isLoading} type="submit">Send</Button>
              </DialogFooter>

            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}