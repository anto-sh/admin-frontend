// Вид лечения
export interface TreatmentDto {
  id: number
  name: string
}

export interface CreateTreatmentDto {
  name: string
}

export interface UpdateTreatmentDto {
  name: string
}

export interface UpdateTreatmentBatchDto {
  id: number
  name: string
}
