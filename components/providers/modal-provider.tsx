"use client";

import { useEffect, useState } from 'react';
import { CreateServerModal } from '../modals/create-server-modal';
import { InviteModal } from '../modals/invite-modal';
import { EditServerModal } from '../modals/edit-server-modal';
import { MembersModal } from '../modals/members-modal';

export function ModalProvider() {

  const [isMounted, setisMounted] = useState(false)

  useEffect(() => {
    setisMounted(true)
  }, [])

  if (!isMounted) return null

  return <>
    <CreateServerModal />
    <InviteModal />
    <EditServerModal />
    <MembersModal />
  </>
}
