<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import ClienteList from '@/components/cliente/ClienteList.vue'
import ClienteSave from '@/components/cliente/ClienteSave.vue'
//import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref<boolean>(false)
const clienteListRef = ref<typeof ClienteList | null>(null)
const clienteEdit = ref<any>(null)

// function hableCreate() {
//   clienteEdit.value = null
//   mostrarDialog.value = true
// }

function handleEdit(cliente: any) {
  clienteEdit.value = cliente
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  clienteListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <h1 style="font-family: 'Times New Roman', sans-serif; font-weight: bold; color:white">Clientes</h1>
    <!-- <Button label="Crear Nuevo" icon="pi pi-plus" @click="hableCreate" /> -->
    <ClienteList ref="clienteListRef" @edit="handleEdit" />
    <ClienteSave
      :mostrar="mostrarDialog"
      :cliente="clienteEdit"
      :modoEdicion="!!clienteEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>



