<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart' // Importa el store del carrito
import http from '@/plugins/axios'
import type { Producto } from '@/models/producto'
import Button from 'primevue/button' // Para usar el botón de PrimeVue

// Lista reactiva para almacenar los productos
const productos = ref<Producto[]>([])

// Usamos el store de Pinia para el carrito
const cartStore = useCartStore()

// Función para obtener todos los productos con stock > 0
async function obtenerProductos() {
  try {
    const response = await http.get('productos')
    productos.value = response.data.filter((producto: Producto) => producto.cantidadDisponible > 0)
  } catch (error) {
    console.error('Error al obtener los productos:', error)
  }
}

// Llamamos a la función `obtenerProductos` cuando el componente se monta
onMounted(() => {
  obtenerProductos()
})

// Función para agregar un producto al carrito
function agregarAlCarrito(producto: Producto) {
  const productoCarrito = {
    ...producto,
    cantidad: 1, // Al agregarlo al carrito, comenzamos con 1
  }
  cartStore.agregarAlCarrito(productoCarrito) // Usamos la acción de Pinia para agregarlo
}
</script>

<template>
  <div>
    <h1 style="font-family: 'Times New Roman', sans-serif; font-weight: bold; color:white">Productos Disponibles</h1>

    <!-- Mensaje cuando no hay productos disponibles -->
    <div v-if="productos.length === 0">No hay productos disponibles con stock.</div>

    <!-- Tabla de productos -->
    <table v-else>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Categoría</th>
          <th>Precio Venta</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in productos" :key="producto.id">
          <td>{{ producto.nombre }}</td>
          <td>{{ producto.descripcion }}</td>
          <!-- Descripción del producto -->
          <td>{{ producto.categoria.nombre }}</td>
          <!-- Categoría del producto -->
          <td>{{ producto.precio }}</td>
          <td>{{ producto.cantidadDisponible }}</td>
          <td>
            <!-- Botón para agregar al carrito -->
            <Button
              icon="pi pi-cart"
              label="Agregar al Carrito"
              @click="agregarAlCarrito(producto)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
