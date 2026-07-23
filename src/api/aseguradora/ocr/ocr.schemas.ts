// El bridge del backend (`POST /ia/ocr/extract-poliza`) no declara un response_model
// propio (responde `{}` en openapi_backend.json) porque solo reenvía el JSON del
// servicio de IA. La forma real viene de `PolizaExtractedResponse` en openapi_iaservice.json.
export interface PolizaExtractedDTO {
  id: string
  filename: string
  numero_poliza: string
  aseguradora: string
  nombre_asegurado: string
  vehiculo_marca: string
  vehiculo_modelo: string
  vehiculo_anio: number
  vehiculo_placas: string
  vehiculo_vin: string | null
  vehiculo_color: string | null
  vigencia_inicio: string
  vigencia_fin: string
}
