<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { onMounted, ref } from 'vue'

const ENDPOINT = 'clientes'
const clientes = ref<Cliente[]>([])
const emit = defineEmits(['edit'])
const clienteDelete = ref<Cliente | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)

async function obtenerLista() {
  clientes.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(cliente: Cliente) {
  emit('edit', cliente)
}

function mostrarEliminarConfirm(cliente: Cliente) {
  clienteDelete.value = cliente
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${clienteDelete.value?.id}`)
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
    <!-- Botón de Crear Nuevo Cliente -->
    <Button
      label="Crear Nuevo Cliente"
      icon="pi pi-plus"
      class="crear-boton"
      @click="emit('edit')" 
    />
    <table class="table-cliente">
      <thead>
        <tr>
          <th>Nro.</th>
          <th>CI</th>
          <th>Nombre</th>
          <th>Apellido Paterno</th>
          <th>Apellido Materno</th>
          <th>telefono</th>
          <th>direccion</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cliente, index) in clientes" :key="cliente.id">
          <td>{{ index + 1 }}</td>
          <td>{{ cliente.ci }}</td>
          <td>{{ cliente.nombre }}</td>
          <td>{{ cliente.apellidoPaterno }}</td>
          <td>{{ cliente.apellidoMaterno }}</td>
          <td>{{ cliente.telefono }}</td>
          <td>{{ cliente.direccion }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(cliente)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(cliente)"
            />
          </td>
        </tr>
      </tbody>
    </table>

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
        <Button type="button" label="Eliminar" @click="eliminar" />
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
.table-cliente {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #f9f9f909;
}

.table-cliente th,
.table-cliente td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid #ffffff;
}

.table-cliente th {
  background-color: #007bff;
  color: rgb(0, 0, 0);
}

.table-cliente tr:nth-child(even) {
  background-color: #f2f2f21a;
}

.table-cliente tr:hover {
  background-color: #f1f1f1;
  color: black;
}

/* Estilo para el botón de crear nuevo */
.crear-boton {
  margin-bottom: 20px;
  background-color: #007bff; /* Color verde */
  color: rgb(3, 3, 3);
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.crear-boton:hover {
  background-color: #0a3058; /* Color verde oscuro al pasar el ratón */
  color: black;
}

/* Estilos para el diálogo de confirmación */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>