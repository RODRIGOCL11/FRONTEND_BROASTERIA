<script setup lang="ts">
import type { Categoria } from '@/models/categoria'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { onMounted, ref } from 'vue'

const ENDPOINT = 'categorias'
const categorias = ref<Categoria[]>([])
const emit = defineEmits(['edit'])
const categoriaDelete = ref<Categoria | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)

async function obtenerLista() {
  categorias.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(categoria: Categoria) {
  emit('edit', categoria)
}

function mostrarEliminarConfirm(categoria: Categoria) {
  categoriaDelete.value = categoria
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${categoriaDelete.value?.id}`)
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
    <!-- Botón de Crear Nueva Categoria -->
    <Button
      label="Crear Nueva Categoria"
      icon="pi pi-plus"
      class="crear-boton"
      @click="emit('edit')" 
    />
    <table class="table-categoria">
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(categoria, index) in categorias" :key="categoria.id">
          <td>{{ index + 1 }}</td>
          <td>{{ categoria.nombre }}</td>
          <td>{{ categoria.descripcion }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(categoria)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(categoria)"
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
.table-categoria {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #f9f9f909;
}

.table-categoria th,
.table-categoria td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid #ffffff;
}

.table-categoria th {
  background-color: #d8ec48;
  color: rgb(0, 0, 0);
}

.table-categoria tr:nth-child(even) {
  background-color: #f2f2f21a;
}

.table-categoria tr:hover {
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
  background-color: #d4ac44;/* Color verde oscuro al pasar el ratón */
  color: black;
}

/* Estilos para el diálogo de confirmación */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>