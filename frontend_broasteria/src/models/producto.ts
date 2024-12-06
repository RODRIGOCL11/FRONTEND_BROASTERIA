import type { Categoria } from './categoria'

export interface Producto {
  id: number

  idCategoria: number

  nombre: string

  descripcion: string

  cantidadDisponible: number

  precio: number

  categoria: Categoria
}
