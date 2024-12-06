// src/models/productoCarrito.ts
import type { Producto } from './producto' // Importación explícita como tipo

// Definir ProductoCarrito como un Producto con la propiedad cantidad
export interface ProductoCarrito extends Producto {
  cantidad: number // Solo existe en el contexto del carrito
}
