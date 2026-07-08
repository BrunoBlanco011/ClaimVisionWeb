import { api } from '../../client'

export async function bloqueoArco(usuarioId: string): Promise<void> {
  await api.post<never>(`/aseguradora/crud/usuarios/${usuarioId}/bloqueo-arco`, {})
}

export async function desbloqueoArco(usuarioId: string): Promise<void> {
  await api.post<never>(`/aseguradora/crud/usuarios/${usuarioId}/desbloqueo-arco`, {})
}
