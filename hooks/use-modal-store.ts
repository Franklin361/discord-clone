import { Server } from '@prisma/client';
import { create } from 'zustand';

 export type ModalType = 'create-server' | 'invite' | 'edit-server' | 'members' | 'create-channel'

interface ModalData {
  server?: Server
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