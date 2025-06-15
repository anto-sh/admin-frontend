import type { ExpertDto } from '../expert/types'

export interface ExpertCategoryDto {
  id: number
  name: string
  url: string
  experts?: ExpertDto[]
}
