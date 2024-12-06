<script lang="ts">
  import { useCartStore } from '@/stores/cart';
  import { computed, ref, onMounted } from 'vue';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import http from '@/plugins/axios';
  import { useAuthStore } from '@/stores/index';
/* eslint-disable @typescript-eslint/no-explicit-any */

  export default {
    components: {
      InputText,
      Button,
      Dialog,
    },
    setup() {
      const mostrarMensaje = ref(false);  // Controla si el modal es visible o no
    const mensaje = ref('');  
      const cartStore = useCartStore();
      
      const mostrarFormularioCliente = ref(false);

      // Estado para almacenar los detalles del cliente seleccionado
      const clienteSeleccionado = ref({
        id: null,
        ci: '',
        nombres: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        celular: ''
      });

      // Lista de clientes para mostrar en el select
      const clientes = ref<any[]>([]);
      const searchCI = ref(''); // Para el select de C.I.

      // Para mostrar la imagen
      const mostrarImagen = ref(false);  // Estado para controlar la visibilidad de la imagen
      const mostrarImagenInicial = ref(false);
      // Cargar clientes del backend
      const obtenerClientes = async () => {
        try {
          const response = await http.get('/clientes');
          clientes.value = response.data;
        } catch (error) {
          console.error('Error al obtener los clientes', error);
        }
      };

      onMounted(() => {
        obtenerClientes();
      });

      // Cuando se selecciona un C.I., se obtiene la información del cliente
      function seleccionarClientePorCI() {
        const clienteEncontrado = clientes.value.find(cliente => cliente.ci === searchCI.value);
        if (clienteEncontrado) {
          clienteSeleccionado.value = clienteEncontrado;
        } else {
          mensaje.value='Cliente no encontrado.';
          mostrarMensaje.value = true;
        }
      }

      // Función para calcular el total del carrito
      const totalCarrito = computed(() => {
  return cartStore.productos.reduce((total, producto) => {
    return total + producto.precio * producto.cantidad;
  }, 0);
});
      // Función para eliminar un producto del carrito
      function eliminarProducto(productoId: number) {
        cartStore.eliminarDelCarrito(productoId);
      }

      // Función para vaciar el carrito
      function vaciarCarrito() {
        cartStore.vaciarCarrito();
      }

      // Función para aumentar la cantidad de un producto
      function aumentarCantidad(productoId: number, cantidadDisponible: number) {
        const producto = cartStore.productos.find(p => p.id === productoId);
        if (producto) {
          if (producto.cantidad >= cantidadDisponible) {
            mensaje.value='!Máximo de unidades disponibles';
            mostrarMensaje.value = true;
          } else{
            producto.cantidad++;
          }
        }
      }

      // Función para disminuir la cantidad de un producto
      function disminuirCantidad(productoId: number) {
        const producto = cartStore.productos.find(p => p.id === productoId);
        if (producto && producto.cantidad > 1) {
          producto.cantidad--;
        }
      }
//Duncion registrar venta dfunciona
function registrarVenta() {
  if (!clienteSeleccionado.value.id) {
    mensaje.value = 'Debe seleccionar un cliente para completar la venta.';
    mostrarMensaje.value = true;
    return;
  }

  if (cartStore.productos.length === 0) {
    mensaje.value='El carrito está vacío. Agrega productos para realizar la venta.';
    mostrarMensaje.value = true;
    return;
  }

  const authStore = useAuthStore();
  const token = authStore.token;
  const userId = authStore.user;

  if (!userId) {
    console.error('El ID del usuario no está disponible.');
    return;
  }

  if (!token) {
    alert('Debe iniciar sesión para completar la venta.');
    return;
  }

  // Calcular el monto total a partir de los productos en el carrito (igual que en registrarVentaQr)
  const montoTotal = totalCarrito.value;  // totalCarrito es la propiedad computada que ya calcula el monto

  const ventaData = {
    idUsuario: userId,
    idCliente: clienteSeleccionado.value.id,
    montoTotal: montoTotal,  // Usamos el montoTotal calculado
  };

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  // Registrar la venta
  http.post('/ventas', ventaData, config)
    .then(response => {
      const idVenta = response.data.id;

      // Crear los detalles de la venta
      const detalleVentaData = cartStore.productos.map(producto => {
        const cantidad = typeof producto.cantidad === 'number' ? producto.cantidad : parseInt(producto.cantidad, 10);
        const precio = typeof producto.precio === 'number' ? producto.precio : parseFloat(producto.precio);
        const subtotal = cantidad * precio;

        return {
          idProducto: producto.id,
          precio: precio,
          cantidad: cantidad,
          subtotal: subtotal,
          idVenta: idVenta,  // Usamos el idVenta que nos devuelve la creación de la venta
        };
      });

      // Verificar que los datos del carrito sean válidos
      if (detalleVentaData.some(detalle => !detalle.idProducto || detalle.cantidad <= 0 || detalle.precio <= 0)) {
        console.error('Datos inválidos en detalleVentaData', detalleVentaData);
        alert('Los datos de los productos en el carrito no son válidos.');
        return;
      }

      // Registrar los detalles de la venta en el backend
      return http.post('/detalleventa', detalleVentaData, config);
    })
    .then(() => {
      cartStore.vaciarCarrito();
      alert('Compra registrada. Tienes un periodo de 3 días para realizar el pago, de lo contrario, la compra será cancelada.');
      
    })
    .catch(error => {
      if (error.response) {
        console.error('Error de backend:', error.response.data);
        alert(`Error del servidor: ${error.response.data.message || 'Intente nuevamente.'}`);
      } else {
        console.error('Error desconocido:', error);
        alert('Hubo un error al conectar con el servidor. Intente nuevamente.');
      }
    });
}

 // Función para mostrar la imagen al presionar el botón
 function mostrarImagenQR() {
        // Aquí puedes definir la URL o el archivo de imagen que quieras mostrar
        mostrarImagen.value = !mostrarImagen.value; 
      }      

      // Función para formatear la moneda
      function formatCurrency(value: number): string {
        return value.toLocaleString('es-BO', {
          style: 'currency',
          currency: 'BOB',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }

      // Función para mostrar el formulario en un modal
      function mostrarFormulario() {
        mostrarFormularioCliente.value = true;
         // Muestra el alert con el mensaje informativo
  setTimeout(() => {
    mensaje.value='Seleccione el cliente. Si sus datos no se encuentran, por favor regístrese como nuevo cliente en el menú.';
    mostrarMensaje.value = true;
  }, 100); // Usamos un pequeño retraso para asegurarnos de que el formulario ya esté visible
      }

      // Función para cerrar el formulario del cliente
      function cerrarFormulario() {
        mostrarFormularioCliente.value = false;
      }

      function aceptarCliente() {
        if (clienteSeleccionado.value.id) {
          cartStore.seleccionarCliente(clienteSeleccionado.value.id);  // Guarda el idCliente en el store
          mostrarFormularioCliente.value = false; // Cierra el formulario
        } else {
          mensaje.value='Debe seleccionar un cliente.';
          mostrarMensaje.value = true;
        }
      }
 // Función para cerrar el mensaje
 function cerrarMensaje() {
      mostrarMensaje.value = false;  // Cierra el modal
    }

  
      return {
        cartStore,
        totalCarrito,
        eliminarProducto,
        vaciarCarrito,
        aumentarCantidad,
        disminuirCantidad,
        registrarVenta,
        clienteSeleccionado,
        formatCurrency,
        mostrarFormulario,
        cerrarFormulario,
        mostrarFormularioCliente,
        clientes,
        searchCI,
        seleccionarClientePorCI,
        aceptarCliente,
        mostrarImagen,
        mostrarImagenQR,
        mostrarMensaje,
        mensaje,
        cerrarMensaje,
      };
    },
  };
</script>

<template>
    <div class="m-8" >
      <h1 style="font-family: 'Times New Roman', sans-serif; font-weight: bold; color:white">Tu Carrito</h1>
         
    <div v-if="cartStore.productos.length === 0" class="empty-cart">
      <p style="font-family: 'Times New Roman', sans-serif; font-weight: bold; color:white">Tu carrito está vacío. </p>
      <p style="font-family: 'Times New Roman', sans-serif; font-weight: bold; color:white">  ¡Agrega algunos productos!</p>
      <div>
        <button @click="mostrarImagenQR" class="generar-qr" :class="{'btn-ocultar': mostrarImagen, 'btn-mostrar': !mostrarImagen}">
          {{ mostrarImagen ? 'Ocultar QR De Pagos' : 'Mostrar QR De Pagos' }}
        </button>
      </div>
         
      <div v-if="mostrarImagen " class="imagen-centrada">
        <img src="/src/assets/images/hola.jpg" alt="Imagen de venta" />
      </div>
    </div>
   
    <div v-else>
      <table class="cart-table">
        <thead>
          <tr>
            <th>N°</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(producto, index) in cartStore.productos" :key="producto.id">
            <td>{{ index + 1 }}</td>
            <td>{{ producto.nombre }}</td>
            <td>{{ producto.categoria.nombre }}</td>
            <td>{{ producto.descripcion }}</td>
            <td>
              <div class="cantidad-controls">
                <button @click="disminuirCantidad(producto.id)" :disabled="producto.cantidad === 1"
                  class="cantidad-btn restar">-</button>
                <span>{{ producto.cantidad }}</span>
                <button @click="aumentarCantidad(producto.id, producto.cantidadDisponible)" class="cantidad-btn">+</button>
              </div>
            </td>
            <td>Bs {{ formatCurrency(producto.precio) }}</td>
            <td>{{ formatCurrency(producto.precio * producto.cantidad) }}</td>
            <td>
              <button @click="eliminarProducto(producto.id)" class="eliminar-btn">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="total">
        <h3>Total: {{ formatCurrency(totalCarrito) }}</h3>
      </div>

      <div class="botones-acciones">
        <button @click="mostrarFormulario" class="seleccionar-cliente">Seleccionar Cliente</button>
        <button @click="vaciarCarrito">Vaciar carrito</button>
        <button @click="registrarVenta" class="registrar-venta">Registrar venta</button>
      </div>
      
      <div>
        <button @click="mostrarImagenQR" class="generar-qr" :class="{'btn-ocultar': mostrarImagen, 'btn-mostrar': !mostrarImagen}">
          {{ mostrarImagen ? 'Ocultar QR De Pagos' : 'Mostrar QR De Pagos' }}
        </button>
      </div>
      
      
      <div v-if="mostrarImagen " class="imagen-centrada">
        <img src="/src/assets/images/hola.jpg" alt="Imagen de venta" />
      </div>

<!-- Modal para mostrar los mensajes -->
<Dialog v-model:visible="mostrarMensaje" header="Mensaje" class="custom-dialog":closable="false">
  <p>{{ mensaje }}</p>
      <template #footer>
        <Button label="Aceptar" icon="pi pi-check" @click="cerrarMensaje" />
      </template>
    </Dialog>



    </div>


    <Dialog v-model:visible="mostrarFormularioCliente" header="Formulario de Cliente" :style="{ width: '700px' }"
      :modal="true" :closable="false">
      <div class="formulario-cliente">
        <h3>Buscar Cliente por C.I.</h3>

        <select v-model="searchCI" @change="seleccionarClientePorCI" class="ci-selector">
          <option value="">Seleccionar C.I.</option>
          <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.ci">{{ cliente.ci }}</option>
        </select>

        <div v-if="clienteSeleccionado.id">
          <!-- Estructura de campos con labels encima -->
          <div class="form-group">
            <label for="ci">C.I:</label>
            <InputText id="ci" v-model="clienteSeleccionado.ci" disabled />
          </div>

          <!-- Nombres, Apellido Paterno y Apellido Materno en la misma fila -->
          <div class="form-group row">
            <div class="col">
              <label for="nombres">Nombres:</label>
              <InputText id="nombres" v-model="clienteSeleccionado.nombres" disabled />
            </div>
            <div class="col">
              <label for="apellidoPaterno">Apellido Paterno:</label>
              <InputText id="apellidoPaterno" v-model="clienteSeleccionado.apellidoPaterno" disabled />
            </div>
            <div class="col">
              <label for="apellidoMaterno">Apellido Materno:</label>
              <InputText id="apellidoMaterno" v-model="clienteSeleccionado.apellidoMaterno" disabled />
            </div>
          </div>

          <div class="form-group row">
            <div class="col">
              <label for="email">Email:</label>
              <InputText id="email" v-model="clienteSeleccionado.email" disabled />
            </div>
            <div class="col">
              <label for="celular">Celular:</label>
              <InputText id="celular" v-model="clienteSeleccionado.celular" disabled />
            </div>
          </div>
        </div>

        <!-- Botón Cerrar con estilo actualizado -->
        <div class="form-buttons">
          <Button label="Cerrar" icon="pi pi-times" @click="cerrarFormulario" class="cerrar-formulario" />
          <Button label="Aceptar" class="aceptar-formulario" @click="aceptarCliente" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
  .carrito-view {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }

 /* Estilo para la tabla del carrito */
 .cart-table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 2px 10px rgba(7, 201, 7, 0.952); /* Sombra sutil alrededor de la tabla */
    background-color: #dadadaa1; /* Fondo claro de la tabla */
    transition: background-color 0.3s ease; /* Transición suave al cambiar el fondo */
  }

  /* Estilo para las cabeceras de la tabla */
  .cart-table th {
    background-color: #67eb67; /* Fondo azul para las cabeceras */
    color: rgb(0, 0, 0); /* Color de texto blanco en las cabeceras */
    padding: 12px 15px;
    text-align: left;
    font-weight: bold;
    text-transform: uppercase;
  }

  /* Estilo para las celdas de la tabla */
  .cart-table td {
    background-color: transparent !important; /* Fondo transparente por defecto */
    padding: 12px 15px;
    text-align: left;
    color: #333; /* Color de texto oscuro para las celdas */
    border: 1px solid #f30505; /* Borde gris claro para las celdas */
    font-size: 14px; /* Tamaño de fuente más pequeño */
  }

  /* Estilo para las filas al pasar el cursor (hover) */
  .cart-table tr:hover {
    background-color: #00ff00; /* Fondo celeste al pasar el cursor */
    transition: background-color 0.3s ease; /* Transición suave en el hover */
  }

  /* Estilo para los bordes de la tabla */
  .cart-table, .cart-table th, .cart-table td {
    border: 1px solid #070707; /* Borde gris claro alrededor de la tabla y celdas */
  }

  .total {
  position: relative; /* Para asegurar que el contenido esté bien posicionado */
  padding: 15px 20px; /* Espaciado alrededor del texto */
  background: rgba(2, 109, 248, 0.966); /* Fondo oscuro con un 50% de opacidad para destacar el texto */
  border-radius: 10px; /* Bordes redondeados */
  max-width: 300px; /* Controlar el tamaño máximo del total */
  margin: 10px auto; /* Centrar el total en la página */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra sutil para resaltar el bloque */
  text-align: center; /* Alinear el texto al centro */
}

.total h3 {
  font-size: 1.5rem; /* Tamaño de fuente para que sea legible */
  font-weight: bold; /* Poner el texto en negrita para mayor énfasis */
  color: #fff; /* Color blanco para que resalte sobre el fondo oscuro */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Sombra de texto para mayor visibilidad */
  margin: 0; /* Eliminar margen por defecto */
}

  .botones-acciones {
    margin-top: 20px;
    text-align: center;
  }

  button {
    background-color: #28a745;
    color: rgb(2, 2, 2);
    border: 1px solid #000;
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    margin: 5px;
    border-radius: 5px;
  }

/* Centrar la imagen */
.imagen-centrada {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

  button:hover {
    background-color: #218838;
  }

  .registrar-venta {
    background-color: #007bff;
    color: rgb(19, 18, 18);
  }

  .registrar-venta:hover {
    background-color: #0056b3;
  }

  .eliminar-btn {
    background-color: #28a745;
    color: rgb(0, 0, 0);
    border: 1px solid black ;
    padding: 8px 15px;
    cursor: pointer;
    border-radius: 5px; /* Bordes redondeados */
  }

  .eliminar-btn:hover {
    background-color: #fc0019;
  }

  .cantidad-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cantidad-btn {
    padding: 5px 10px;
    border: 1px solid #000;
    cursor: pointer;
    background-color: #f2f2f2;
  }

  /* Estilo para mantener la estructura en 3 campos arriba y 2 abajo */
  .formulario-cliente {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #27c23c; /* Fondo claro para el formulario */
    padding: 20px;
    border-radius: 8px; /* Bordes redondeados */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra para resaltar el formulario */
    color: #333; /* Color de texto oscuro para la legibilidad */
    border: 1px solid #ccc; /* Borde gris suave */
  }

  .ci-selector {
    width: 150%;
    max-width: 150px;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #000000;
    border-radius: 5px;
    background-color: #fff;
    color: #333; /* Color del texto en el select */
    transition: border-color 0.3s ease;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group.row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .col {
    width: 32%;
    /* Ajuste para que los tres campos quepan en una fila */
  }

  label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #444;
  }
/* Estilo para los campos InputText */
.form-group input {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #070707;
    border-radius: 5px;
    background-color: #fff;
    color: #333;
    transition: border-color 0.3s ease;
  }




  .dialog-content {
    max-width: 700px;
  }

  /* Estilo para el botón cerrar sin cambio de color al pasar el cursor */
  .form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  .aceptar-formulario {
    background-color: #28a745;
    color: rgb(7, 7, 7);
    padding: 8px 16px;
    border: 1px solid black;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
  }

  .aceptar-formulario:hover {
    background-color: #c82333;
  }

  .cerrar-formulario {
    background-color: #ff0000;
    color: rgb(255, 255, 255);
    padding: 8px 16px;
    border: 1px solid black;
    border-radius: 5px;
    cursor: pointer;
    width: auto;
    max-width: 200px;
    transition: background-color 0.3s ease;
  }

  .cerrar-formulario:hover {
    background-color: #218838;
  }

  /* Estilo para el botón Generar QR */
  .generar-qr {
    background-color: #ff9800; /* Color naranja */
    color: rgb(2, 2, 2);
    border: 1px solid #080808;
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    margin: 5px;
  }

  .generar-qr:hover {
    background-color: #fb8c00; /* Naranja más oscuro */
    border: 1px solid #000000;
  }



  /* Estilo personalizado para el Dialog */
.custom-dialog .p-dialog {
  background-color: #ee0000 !important; /* Fondo */
  border: 2px solid #4CAF50 !important; /* Borde */
  color: #fbfdfb ; /* Color del texto */
}

.custom-dialog .p-dialog-header {
  background-color: #4CAF50 !important; /* Fondo del header */
  color: rgb(255, 255, 255) ; /* Color del texto del header */
}


.custom-dialog .p-button {
  background-color: #28a745 !important; /* Color del botón */
  color: white !important;
}

.custom-dialog .p-button:hover {
  background-color: #218838 !important; /* Hover del botón */
}

/* Estilo cuando el botón dice 'Mostrar QR De Pagos' */
.btn-mostrar {
  background-color: #d6b522; /* Verde */
  color: rgb(0, 0, 0);
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
}

/* Estilo cuando el botón dice 'Ocultar QR De Pagos' */
.btn-ocultar {
  background-color: #225dff; /* Naranja */
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
}


</style>