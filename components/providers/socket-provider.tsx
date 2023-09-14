"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { io as ClientIO } from 'socket.io-client';

type SocketContextType = {
  socket: any | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({ isConnected: false, socket: null })

interface Props {
  children: React.ReactNode
}



export function SocketProvider({ children }: Props) {

  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)


  useEffect(() => {
    const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: '/api/socket/io',
      addTrailingSlash: false
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])


  return (
    <SocketContext.Provider
      value={{ isConnected, socket }}
    >
      {children}
    </SocketContext.Provider >
  )
};


export const useSocket = () => useContext(SocketContext)