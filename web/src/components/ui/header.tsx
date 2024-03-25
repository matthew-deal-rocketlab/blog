import { cn } from '../../lib/utils'

const header = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
} as const

type HeaderProps = {
  level: Header
  text: string
  className?: string
}

export type Header = (typeof header)[keyof typeof header]

export default function HeaderTag({ level, text, className }: HeaderProps) {
  const headerClasses = cn(
    'text-[#221D2A]',
    {
      'md:text-5xl text-4xl': level === header.h1,
      'text-4xl': level === header.h2,
      'text-3xl': level === header.h3,
      'text-2xl': level === header.h4,
      'text-xl': level === header.h5,
      'text-lg': level === header.h6,
    },
    className,
  )

  const HeaderTag = level as keyof JSX.IntrinsicElements

  return <HeaderTag className={headerClasses}>{text}</HeaderTag>
}
