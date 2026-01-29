export type PriceCategory = 'opportunity' | 'fair' | 'expensive' | 'overpriced'

export interface BaseButtonProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

export interface BaseInputProps {
  label?: string
  error?: string
  placeholder?: string
  disabled?: boolean
}

export interface BaseBadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | PriceCategory
}

export interface BaseCardProps {
  className?: string
}

export interface BaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}
