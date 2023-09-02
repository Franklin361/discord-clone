'use client';

import Image from 'next/image'
import { X } from 'lucide-react'

import { UploadDropzone } from '@/lib/uploadthing';
import "@uploadthing/react/styles.css";

interface Props {
  endpoint: 'messageFile' | 'serverImage'
  value: string
  onChange: (...event: any[]) => void
}

export const FileUpload = ({ endpoint, onChange, value }: Props) => {

  const fileType = value?.split('.').pop()

  if (value && fileType !== 'pdf') return (
    <div className='relative h-20 w-20'>
      <Image
        fill
        src={value}
        alt='upload'
        className='rounded-full object-cover'
      />
      <button
        onClick={() => onChange('')}
        type='button'
        className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm'
      >
        <X className='h-4 w-4' />
      </button>
    </div>
  )

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={res => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => {
        console.log(error.cause)
        console.log(error.message)
        console.log(error.name)
        alert('Please select other image!')
      }}
    />
  )
}
export default FileUpload