import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
  label: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'right' | 'left'
  align?: 'center' | 'start' | 'end'
}

export const ActionTooltip = ({
  children,
  label,
  align,
  side
}: Props) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent align={align} side={side}>
          <p className='font-semibold text-sm capitalize'>
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

  )
}
export default ActionTooltip