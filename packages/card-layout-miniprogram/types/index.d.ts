export * from '../src/utils/card-schema'

export interface CardTagProps {
  text?: string
  theme?: 'primary' | 'warning' | 'success'
  round?: boolean
}
