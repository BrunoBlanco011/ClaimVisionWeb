import { ApiError } from './client'

interface ValidationDetail {
  loc?: (string | number)[]
  msg: string
}

function fieldLabel(loc?: (string | number)[]): string {
  if (!loc || loc.length === 0) return ''
  const field = loc[loc.length - 1]
  return typeof field === 'string' ? field : ''
}

// Traduce el cuerpo de error del backend (FastAPI: `{"error": "..."}`,
// `{"detail": "..."}` o `{"details":[{"loc":[...], "msg":"..."}]}`) a un
// mensaje en español entendible; si no hay cuerpo útil, cae a un mensaje
// genérico según el status HTTP.
export function getErrorMessage(err: unknown, fallback = 'Ocurrió un error inesperado. Intenta de nuevo.'): string {
  if (err instanceof ApiError) {
    const body = err.body as { error?: string; detail?: string; details?: ValidationDetail[] } | null

    if (Array.isArray(body?.details) && body.details.length > 0) {
      return body.details
        .map((d) => {
          const field = fieldLabel(d.loc)
          return field ? `${field}: ${d.msg}` : d.msg
        })
        .join(' · ')
    }
    if (typeof body?.error === 'string' && body.error) return body.error
    if (typeof body?.detail === 'string' && body.detail) return body.detail

    switch (err.status) {
      case 401:
        return 'Tu sesión expiró o no es válida. Inicia sesión de nuevo.'
      case 403:
        return 'No tienes permisos para realizar esta acción.'
      case 404:
        return 'No se encontró el recurso solicitado.'
      case 409:
        return 'La operación no se pudo completar porque entra en conflicto con datos existentes.'
      case 422:
        return 'Algunos datos del formulario no son válidos. Revísalos e intenta de nuevo.'
      case 500:
      case 502:
      case 503:
        return 'El servidor no pudo procesar la solicitud. Intenta de nuevo más tarde.'
      default:
        return fallback
    }
  }

  if (err instanceof TypeError) {
    return 'No se pudo conectar con el servidor. Revisa tu conexión a internet.'
  }

  return fallback
}
