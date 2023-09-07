import { cn } from '@/lib/utils'
import { AvatarImage, Avatar } from './ui/avatar'



interface Props {
  src?: string
  className?: string
}

export const UserAvatar = ({ className, src }: Props) => {
  return (
    <Avatar className={cn(
      'h-7 w-7 md:h-10 md:w-10',
      className
    )}>
      <AvatarImage src={src} />
    </Avatar>
  )
}