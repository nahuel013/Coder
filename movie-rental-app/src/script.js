import { register, login, logout, getCurrentUser } from './auth.js';

// Cargar películas desde JSON
let peliculas = [];
fetch('movie-rental-app/src/peliculas.json')
  .then(res => res.json())
  .then(data => {
    peliculas = data;
    mostrarPeliculas(peliculas);
    renderizarCarrito();
    renderizarHistorial();
  });

const catalogoDiv = document.getElementById('catalogo');
const carritoUl = document.getElementById('carrito').querySelector('ul');
const totalP = document.getElementById('total');
const vaciarBtn = document.getElementById('vaciar');
const finalizarBtn = document.getElementById('finalizar');
const modal = document.getElementById('modal');
const cerrarModalBtn = document.getElementById('cerrarModal');
const confirmarPagoBtn = document.getElementById('confirmarPago');
const metodoPagoSelect = document.getElementById('metodoPago');
const modalTotal = document.getElementById('modal-total');
const formPago = document.getElementById('form-pago');
const mensajeFinal = document.getElementById('mensaje-final');
const resumen = document.getElementById('resumen');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Carrito por usuario
function getCarrito() {
  const user = getCurrentUser();
  if (!user) return [];
  return JSON.parse(localStorage.getItem('carrito_' + user.username)) || [];
}
function guardarCarrito(carrito) {
  const user = getCurrentUser();
  if (!user) return;
  localStorage.setItem('carrito_' + user.username, JSON.stringify(carrito));
}

// Historial por usuario
function getRentalHistory() {
  const user = getCurrentUser();
  if (!user) return {};
  return JSON.parse(localStorage.getItem('rentalHistory_' + user.username)) || {};
}
function guardarRentalHistory(hist) {
  const user = getCurrentUser();
  if (!user) return;
  localStorage.setItem('rentalHistory_' + user.username, JSON.stringify(hist));
}

// Lógica de alquiler
function agregarAlCarrito(e) {
  const user = getCurrentUser();
  if (!user) {
    Swal.fire('Debe iniciar sesión para alquilar.', '', 'warning');
    return;
  }
  const id = parseInt(e.target.dataset.id);
  const carrito = getCarrito();
  if (carrito.some(p => p.id === id)) {
    Swal.fire('Ya agregaste esta película al carrito.', '', 'info');
    return;
  }
  const pelicula = peliculas.find(p => p.id === id);
  carrito.push({ ...pelicula, rentalDuration: 1 });
  guardarCarrito(carrito);
  renderizarCarrito();
  mostrarPeliculas(peliculas);
}

function eliminarDelCarrito(index) {
  const carrito = getCarrito();
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  renderizarCarrito();
}

function mostrarPeliculas(lista) {
  catalogoDiv.innerHTML = '';
  const user = getCurrentUser();
  lista.forEach(pelicula => {
    const item = document.createElement('div');
    item.className = 'pelicula';
    item.innerHTML = `
      <img src="${pelicula.imagen}" alt="${pelicula.titulo}" class="poster">
      <h3>${pelicula.titulo}</h3>
      <p>Género: ${pelicula.genero}</p>
      <p>Precio: $${pelicula.precio}</p>
      <button data-id="${pelicula.id}" class="add-btn${!user ? ' disabled-btn' : ''}">Agregar al carrito</button>
    `;
    catalogoDiv.appendChild(item);
  });
  const botones = document.querySelectorAll('.pelicula button');
  botones.forEach(btn => {
    btn.addEventListener('click', agregarAlCarrito);
  });
}

function renderizarCarrito() {
  const carrito = getCarrito();
  carritoUl.innerHTML = '';
  carrito.forEach((p, index) => {
    const li = document.createElement('li');
    li.textContent = `${p.titulo} - $${p.precio} (Duración: ${p.rentalDuration} días)`;
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '❌';
    btnEliminar.addEventListener('click', () => eliminarDelCarrito(index));
    li.appendChild(btnEliminar);
    carritoUl.appendChild(li);
  });
  const total = carrito.reduce((acc, p) => acc + p.precio, 0);
  totalP.textContent = `Total a pagar: $${total}`;
}

vaciarBtn.addEventListener('click', (e) => {
  if (vaciarBtn.disabled) {
    Swal.fire('Debe iniciar sesión para vaciar el carrito.', '', 'warning');
    return;
  }
  guardarCarrito([]);
  renderizarCarrito();
});

finalizarBtn.addEventListener('click', (e) => {
  if (finalizarBtn.disabled) {
    Swal.fire('Debe iniciar sesión para finalizar el alquiler.', '', 'warning');
    return;
  }
  const carrito = getCarrito();
  if (carrito.length === 0) {
    modalTotal.textContent = 'El carrito está vacío.';
    metodoPagoSelect.style.display = 'none';
    confirmarPagoBtn.style.display = 'none';
  } else {
    const total = carrito.reduce((acc, p) => acc + p.precio, 0);
    modalTotal.textContent = `Total a pagar: $${total}`;
    metodoPagoSelect.style.display = 'inline-block';
    confirmarPagoBtn.style.display = 'inline-block';
  }
  formPago.style.display = 'block';
  mensajeFinal.style.display = 'none';
  modal.style.display = 'block';
});

cerrarModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

confirmarPagoBtn.addEventListener('click', () => {
  const metodo = metodoPagoSelect.value;
  if (!metodo) {
    Swal.fire('Seleccione un método de pago válido.', '', 'warning');
    return;
  }
  const carrito = getCarrito();
  const total = carrito.reduce((acc, p) => acc + p.precio, 0);
  // Guardar en historial (array por película)
  const history = getRentalHistory();
  carrito.forEach(p => {
    if (!Array.isArray(history[p.id])) {
      history[p.id] = [];
    }
    history[p.id].push({
      rentalDuration: p.rentalDuration,
      fecha: new Date().toISOString()
    });
  });
  guardarRentalHistory(history);
  renderizarHistorial();

  resumen.innerHTML = `
    Método de pago: <strong>${metodo}</strong><br>
    Total pagado: <strong>$${total}</strong>
  `;
  formPago.style.display = 'none';
  mensajeFinal.style.display = 'block';
  guardarCarrito([]);
  renderizarCarrito();
  mostrarPeliculas(peliculas);

  Swal.fire('¡Compra realizada!', 'Gracias por su compra.', 'success');
  setTimeout(() => {
    modal.style.display = 'none';
    formPago.style.display = 'block';
    mensajeFinal.style.display = 'none';
    resumen.innerHTML = '';
    metodoPagoSelect.value = '';
  }, 1500);
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Historial de alquileres
function renderizarHistorial() {
  const historialUl = document.getElementById('historial-lista');
  if (!historialUl) return;
  const history = getRentalHistory();
  historialUl.innerHTML = '';
  const ids = Object.keys(history);
  if (ids.length === 0) {
    historialUl.innerHTML = '<li>No hay alquileres previos.</li>';
    return;
  }
  ids.forEach(id => {
    const peli = peliculas.find(p => p.id == id);
    if (peli && Array.isArray(history[id])) {
      history[id].forEach(registro => {
        const li = document.createElement('li');
        li.textContent = `${peli.titulo} - Alquilada el: ${new Date(registro.fecha).toLocaleDateString()} (${registro.rentalDuration} días)`;
        historialUl.appendChild(li);
      });
    }
  });
}

// Estado de login (puedes eliminar si no usas login)
function actualizarEstadoLogin() {
  const user = getCurrentUser();
  if (user) {
    usernameInput.style.display = 'none';
    passwordInput.style.display = 'none';
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
  } else {
    usernameInput.style.display = 'inline-block';
    passwordInput.style.display = 'inline-block';
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  }
  
  carritoUl.parentElement.parentElement.style.display = 'block';
  // Habilitar/deshabilitar botones de carrito
  vaciarBtn.disabled = !user;
  finalizarBtn.disabled = !user;
}

// Login y registro (puedes eliminar si no usas login)
registerBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) {
    Swal.fire('Ingrese usuario y contraseña', '', 'warning');
    return;
  }
  if (register(username, password)) {
    Swal.fire('Usuario creado. Ahora puede iniciar sesión.', '', 'success');
  } else {
    Swal.fire('El usuario ya existe.', '', 'error');
  }
});

loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (login(username, password)) {
    Swal.fire('Login exitoso', '', 'success');
    actualizarEstadoLogin();
    renderizarCarrito();
    mostrarPeliculas(peliculas);
    renderizarHistorial();
  } else {
    Swal.fire('Usuario o contraseña incorrectos', '', 'error');
  }
});

logoutBtn.addEventListener('click', () => {
  logout();
  actualizarEstadoLogin();
  renderizarCarrito();
  mostrarPeliculas(peliculas);
  renderizarHistorial();
});

window.addEventListener('DOMContentLoaded', () => {
  actualizarEstadoLogin();
  renderizarCarrito();
  mostrarPeliculas(peliculas);
  renderizarHistorial();
});