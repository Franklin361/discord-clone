import { create } from 'zustand';

 export type ModalType = 'create-server'

 interface ModalState {
  type: ModalType | null
  isOpen: boolean
  onOpen: (type:ModalType) => void
  onClose: () => void
 }

 export const useModal = create<ModalState>(set => ({
  isOpen: false,
  type: null,
  onClose: ( ) => set({ type: null, isOpen: false }),
  onOpen: (type:ModalType ) => set({ type, isOpen: true }),
 }))