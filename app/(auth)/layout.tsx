
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Chat | Login'
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='h-full flex justify-center items-center'>
      {children}
    </div>
  )
}
