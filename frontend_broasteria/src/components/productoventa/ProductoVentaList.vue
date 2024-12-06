<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import http from '@/plugins/axios'
import type { Producto } from '@/models/producto'

const productos = ref<Producto[]>([])

// Función para obtener la lista de productos
async function obtenerProductos() {
  try {
    const response = await http.get('productos') // Asegúrate de que este endpoint sea el correcto
    productos.value = response.data
  } catch (error) {
    console.error('Error al cargar los productos:', error)
  }
}

// Cargar los productos cuando el componente se monta
onMounted(() => {
  obtenerProductos()
})
</script>

<template>
  <div>
    <h1 style="font-family: 'Times New Roman', sans-serif; font-weight: bold; color:white">Lista de Productos</h1>
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Nombre</th>
          <th>Precio Venta</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in productos" :key="producto.id">
          <td>{{ producto.categoria }}</td>
          <td>{{ producto.nombre }}</td>
          <td>{{ producto.precio }}</td>
          <td>{{ producto.cantidadDisponible }}</td>
          <td>
            <RouterLink :to="'/productosVenta/' + producto.id">
              <button>Ver Producto</button>
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Estilos básicos para la tabla */
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  border: 1px solid #ddd;
}
th {
  background-color: #f4f4f4;
}
</style>
