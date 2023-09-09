"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useModal } from '@/hooks/use-modal-store';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';

export const LeaveServerModal = () => {

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { isOpen, onClose, type, data } = useModal()

  const { server } = data

  const isModalOpen = isOpen && type === 'leave-server'

  const onLeaveServer = async () => {
    try {
      setIsLoading(true)
      const response = await axios.patch(`/api/servers/${server?.id}/leave`)
      onClose()
      router.refresh()
      router.replace(response.data.nextServer)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className='pt-8 px-6'>
            <DialogTitle className='text-2xl text-center font-bold'>Leave Server</DialogTitle>
            <DialogDescription className='text-center text-zinc-500'>Are you sure you want to leave <span className='font-semibold text-indigo-500'>{server?.name}</span>? </DialogDescription>
          </DialogHeader>
          <DialogFooter className='bg-gray-100 px-6 py-4'>
            <div className='flex items-center justify-between w-full'>
              <Button
                disabled={isLoading}
                variant='ghost'
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                variant='primary'
                onClick={onLeaveServer}
              >
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}