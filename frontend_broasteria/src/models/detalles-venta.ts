import type { Producto } from './producto'
import type { Venta } from './venta'

export interface DetallesVenta {
  id: number

  idProducto: number

  idVenta: number

  cantidad: number

  producto: Producto

  venta: Venta
}
