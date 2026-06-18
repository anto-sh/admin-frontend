export interface FileDataDto {
  url: string
  originalname: string
  mimetype: string
  size: number
  extension: string
}

export interface ValidationError {
  target: Record<string, unknown>
  value: unknown
  property: string
  children: unknown[]
  constraints: Record<string, string>
}
