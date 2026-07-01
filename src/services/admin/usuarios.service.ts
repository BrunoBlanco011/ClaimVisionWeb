import { api } from '../api'

const MOCK = false

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

export async function bloqueoArco(usuarioId: string): Promise<void> {
  if (MOCK) {
    await delay(200)
    return
  }
  await api.post<never>(`/admin/usuarios/${usuarioId}/bloqueo-arco`, {})
}
