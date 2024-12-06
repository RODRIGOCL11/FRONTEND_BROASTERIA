<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/index'

const nombreUsuario = ref('')
const clave = ref('')
const error = ref(false)

function onSubmit() {
  const authStore = useAuthStore()
  authStore.login(nombreUsuario.value, clave.value).catch(() => (error.value = true))
}
</script>

<template>
  <div class="login-container">
    <div class="header">
      <h1 class="title">Iniciar Sesión</h1>
    </div>
    <form class="form" @submit.prevent="onSubmit">
      <label class="form-label">Usuario:</label>
      <input
        v-model="nombreUsuario"
        type="text"
        class="form-input"
        placeholder="Usuario"
        autofocus
      />
      <label class="form-label">Contraseña:</label>
      <input v-model="clave" type="password" class="form-input" placeholder="Contraseña" />
      <p v-if="error" class="text-danger">Usuario y/o contraseña incorrectos</p>
      <input type="submit" class="form-submit" value="Ingresar" />
    </form>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; /* Apilar el título y el formulario */
}
.header {
  width: 100%; /* Asegura que el título ocupe todo el ancho */
  display: flex;
  margin-bottom: 20px; /* Espacio entre título y formulario */
  margin-left: 64%; 
}
.title {
  color: #000000;
  text-align: right;
  font-size: 2rem;
  margin-bottom: 1rem;  
}
.form {
  margin: 1.5rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20%;
  min-width: 350px;
  max-width: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 4px 10px 4px rgba(255, 255, 255, 0.678);
}

.form-label {
  margin-top: 2rem;
  color: rgb(3, 0, 0);
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 10px 15px;
  background: none;
  background-image: none;
  border: 1px solid rgb(0, 0, 0);
  color: rgb(12, 12, 12);
}

.form-submit {
  background: #030303;
  border: none;
  border-radius: 5rem;
  color: white;
  margin-top: 3rem;
  padding: 1rem 0;
  cursor: pointer;
  transition: background 0.2s;
}
</style>
