import type { Cliente } from './cliente'

export interface Venta {
  id: number

  idCliente: number

  fechaVenta: Date

  total: number

  cliente: Cliente
}
