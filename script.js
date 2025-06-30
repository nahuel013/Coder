const peliculas = [
  { id: 1, titulo: "Rápidos y Furiosos", genero: "Acción", precio: 500 , imagen: "img/ff1.jpg"},
  { id: 2, titulo: "Toy Story", genero: "Animación", precio: 400 , imagen: "img/ts1.jpg"},
  { id: 3, titulo: "La La Land", genero: "Drama", precio: 450 , imagen: "img/ll1.jpg"},
  { id: 4, titulo: "The Hangover", genero: "Comedia", precio: 350 , imagen: "img/ho1.jpg"},
  { id: 5, titulo: "Gladiador", genero: "Acción", precio: 550 , imagen: "img/g.jpg"},
];

const catalogoDiv = document.getElementById('catalogo');
const carritoUl = document.getElementById('carrito');
const generoSelect = document.getElementById('genero');
const totalP = document.getElementById('total');
const vaciarBtn = document.getElementById('vaciar');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function mostrarPeliculas(lista) {
  catalogoDiv.innerHTML = '';

  lista.forEach(pelicula => {
    const item = document.createElement('div');
    item.className = 'pelicula';
    item.innerHTML = `
      <img src="${pelicula.imagen}" alt="${pelicula.titulo}" class="poster">
  <h3>${pelicula.titulo}</h3>
  <p>Género: ${pelicula.genero}</p>
  <p>Precio: $${pelicula.precio}</p>
  <button data-id="${pelicula.id}">Agregar al carrito</button>
`;
    catalogoDiv.appendChild(item);
  });

  const botones = document.querySelectorAll('.pelicula button');
  botones.forEach(btn => {
    btn.addEventListener('click', agregarAlCarrito);
  });
}

generoSelect.addEventListener('change', () => {
  const filtro = generoSelect.value;

  if (filtro === 'todos') {
    mostrarPeliculas(peliculas);
  } else {
    const filtradas = peliculas.filter(p => p.genero === filtro);
    mostrarPeliculas(filtradas);
  }
});

function agregarAlCarrito(e) {
  const id = parseInt(e.target.dataset.id);
  const pelicula = peliculas.find(p => p.id === id);

  carrito.push(pelicula);
  guardarCarrito();
  renderizarCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  renderizarCarrito();
}

vaciarBtn.addEventListener('click', () => {
  carrito = [];
  guardarCarrito();
  renderizarCarrito();
});

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function renderizarCarrito() {
  carritoUl.innerHTML = '';

  carrito.forEach((p, index) => {
    const li = document.createElement('li');
    li.textContent = `${p.titulo} - $${p.precio}`;

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '❌';
    btnEliminar.style.background = 'none';
    btnEliminar.style.border = 'none';
    btnEliminar.style.cursor = 'pointer';
    btnEliminar.style.fontSize = '1.1em';
    btnEliminar.style.marginLeft = '8px';
    btnEliminar.addEventListener('click', () => eliminarDelCarrito(index));

    li.appendChild(btnEliminar);
    carritoUl.appendChild(li);
  });

  const total = carrito.reduce((acc, p) => acc + p.precio, 0);
  totalP.textContent = `Total a pagar: $${total}`;
}

// Finalizar alquiler con selección de pago
const finalizarBtn = document.getElementById('finalizar');

const modal = document.getElementById('modal');
const cerrarModalBtn = document.getElementById('cerrarModal');
const confirmarPagoBtn = document.getElementById('confirmarPago');
const metodoPagoSelect = document.getElementById('metodoPago');
const modalTotal = document.getElementById('modal-total');

const formPago = document.getElementById('form-pago');
const mensajeFinal = document.getElementById('mensaje-final');
const resumen = document.getElementById('resumen');

// Abre modal
finalizarBtn.addEventListener('click', () => {
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

// Cierra modal
cerrarModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Confirmar pago dentro del modal
confirmarPagoBtn.addEventListener('click', () => {
  const metodo = metodoPagoSelect.value;

  if (!metodo) {
    // Mostrar mensaje de error dentro del modal
    modalTotal.textContent = 'Seleccione un método de pago válido.';
    return;
  }

  const total = carrito.reduce((acc, p) => acc + p.precio, 0);

  // Mostrar mensaje final en el mismo modal
  resumen.innerHTML = `
    Método de pago: <strong>${metodo}</strong><br>
    Total pagado: <strong>$${total}</strong>
  `;

  formPago.style.display = 'none';
  mensajeFinal.style.display = 'block';

  carrito = [];
  guardarCarrito();
  renderizarCarrito();
  metodoPagoSelect.value = ''; // Reset
});

// Cierra modal si hace clic fuera
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Inicializar
mostrarPeliculas(peliculas);
renderizarCarrito();
