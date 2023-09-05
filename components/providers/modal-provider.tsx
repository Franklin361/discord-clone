"use client";

import { useEffect, useState } from 'react';
import { CreateServerModal } from '../modals/create-server-modal';

export function ModalProvider() {

  const [isMounted, setisMounted] = useState(false)

  useEffect(() => {
    setisMounted(true)
  }, [])

  if (!isMounted) return null

  return <>
    <CreateServerModal />
  </>
}
