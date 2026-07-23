import { api } from '../../client'
import type { PolizaExtractedDTO } from './ocr.schemas'

export async function extractPoliza(file: File): Promise<PolizaExtractedDTO> {
  const formData = new FormData()
  formData.append('file', file)
  return api.postForm<PolizaExtractedDTO>('/ia/ocr/extract-poliza', formData)
}
