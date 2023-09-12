import { Channel, ChannelType, Server } from '@prisma/client';
import { create } from 'zustand';

 export type ModalType =   'invite' |  'members'  | 
 'create-server' | 'edit-server' | 'leave-server' | 'delete-server' |
 'create-channel' | 'edit-channel' | 'delete-channel'

interface ModalData {
  server?: Server
  channel?:Channel
  channelType?:ChannelType
}

 interface ModalState {
  type: ModalType | null
  data: ModalData
  isOpen: boolean
  onOpen: (type:ModalType, data?:ModalData) => void
  onClose: () => void
 }

 export const useModal = create<ModalState>(set => ({
   isOpen: false,
   data: {},
  type: null,
  onClose: ( ) => set({ type: null, isOpen: false }),
  onOpen: (type:ModalType, data = {} ) => set({ type, isOpen: true, data }),
 }))