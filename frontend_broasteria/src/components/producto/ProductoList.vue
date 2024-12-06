<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { onMounted, ref } from 'vue'

const ENDPOINT = 'productos'
const productos = ref<Producto[]>([])
const emit = defineEmits(['edit'])
const productoDelete = ref<Producto | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)

async function obtenerLista() {
  productos.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(producto: Producto) {
  emit('edit', producto)
}

function mostrarEliminarConfirm(producto: Producto) {
  productoDelete.value = producto
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${productoDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div class="container">
    <!-- Botón de Crear Nuevo Producto -->
    <Button
      label="Crear Nuevo Producto"
      icon="pi pi-plus"
      class="crear-boton"
      @click="emit('edit')" 
    />

    <!-- Tabla de productos -->
    <table class="tabla-productos">
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Categoria</th>
          <th>Nombre</th>
          <th>Descripcion</th>
          <th>Cantidad disponible</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(producto, index) in productos" :key="producto.id">
          <td>{{ index + 1 }}</td>
          <td>{{ producto.categoria.nombre }}</td>
          <td>{{ producto.nombre }}</td>
          <td>{{ producto.descripcion }}</td>
          <td>{{ producto.cantidadDisponible }}</td>
          <td>{{ producto.precio }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(producto)" style="color: white;" />
            <Button
            style="color: white;"
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(producto)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Diálogo de Confirmación de Eliminación -->
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" style="color: white;"/>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
/* Contenedor principal */
.container {
  max-width: 1200px; /* Limitar el ancho */
  margin: 0 auto; /* Centrar el contenido */
  padding: 20px; /* Espaciado interno para evitar que los elementos toquen los bordes */
}

/* Estilo para la tabla */
.tabla-productos {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #f9f9f909;
}

.tabla-productos th,
.tabla-productos td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid #ffffff;
}

.tabla-productos th {
  background-color: #d8ec48;
  color: rgb(0, 0, 0);
}

.tabla-productos tr:nth-child(even) {
  background-color: #f2f2f21a;
}

.tabla-productos tr:hover {
  background-color: #f1f1f1;
  color: black;
}

/* Estilo para el botón de crear nuevo */
.crear-boton {
  margin-bottom: 20px;
  background-color: #d8ec48; /* Color verde */
  color: rgb(3, 3, 3);
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.crear-boton:hover {
  background-color: #d4ac44; /* Color verde oscuro al pasar el ratón */
  color: black;
}

/* Estilos para el diálogo de confirmación */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>