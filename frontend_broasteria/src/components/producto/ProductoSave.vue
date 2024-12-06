<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Producto } from '@/models/producto'
import type { Categoria } from '@/models/categoria'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

import { computed, ref, watch } from 'vue'
import { ColorPicker } from 'primevue'

const ENDPOINT = 'productos'
const props = defineProps({
  mostrar: Boolean,
  producto: {
    type: Object as () => Producto,
    default: () => ({}) as Producto,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const categorias = ref<Categoria[]>([])

async function obtenerCategorias() {
  categorias.value = await http.get('categorias').then((response) => response.data)
}

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const producto = ref<Producto>({ ...props.producto })
watch(
  () => props.producto,
  (newVal) => {
    producto.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      idCategoria: producto.value.categoria.id,
      nombre: producto.value.nombre,
      descripcion: producto.value.descripcion,
      cantidadDisponible: producto.value.cantidadDisponible,
      precio: producto.value.precio,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${producto.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    producto.value = {} as Producto
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerCategorias()
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar' : 'Crear'"
      style="width: 25rem; color: white;"
    >
      <div class="form-group">
        <label for="categoria" class="form-label">Categoria</label>
        <Select
          id="categoria"
          :options="categorias" :style="ColorPicker"
          v-model="producto.categoria"
          optionLabel="nombre"
          placeholder="Selecciona una categoria"
          class="form-input"
        ></Select>
      </div>
      <div class="form-group">
        <label for="nombre" class="form-label">Nombre</label>
        <InputText
          id="nombre"
          v-model="producto.nombre"
          class="form-input"
          autocomplete="off"
          autofocus
        />
      </div>
      <div class="form-group">
        <label for="descripcion" class="form-label">Descripción</label>
        <InputText
          id="descripcion"
          v-model="producto.descripcion"
          class="form-input"
          autocomplete="off"
          autofocus
        />
      </div>
      <div class="form-group">
        <label for="cantidadDisponible" class="form-label">Cantidad disponible</label>
        <InputText
          id="cantidadDisponible"
          type="number"
          v-model.number="producto.cantidadDisponible"
          class="form-input"
          autocomplete="off"
        />
      </div>
      <div class="form-group">
        <label for="precio" class="form-label">Precio</label>
        <InputText
          id="precio"
          type="number"
          v-model.number="producto.precio"
          class="form-input"
          autocomplete="off"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
        style="color: white;"
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" style="color: white;" @click="handleSave "></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-label {
  flex: 1; /* Las etiquetas ocupan el mismo ancho */
  text-align: right; /* Alinea el texto a la derecha */
  font-weight: bold;
}

.form-input {
  flex: 2; /* Los campos de entrada ocupan el doble de ancho que las etiquetas */
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
.custom-input {
  background-color: rgb(0, 0, 0) !important; /* Fondo amarillo para los campos */
  border: 1px solid #ccc; /* Borde gris para los campos */
  color: rgb(255, 252, 252);  /* Color del texto en los inputs */
  padding: 0.5rem;
}

.custom-input:focus {
  border-color: #0a3058;  /* Color de borde azul cuando el campo está en foco */
  outline: none;  /* Quitar el borde de enfoque predeterminado */
}
</style>
