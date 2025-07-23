let rentalHistory = JSON.parse(localStorage.getItem('rentalHistory')) || {};

function agregarHistorial(usuario, pelicula, duracion) {
    if (!rentalHistory[usuario]) {
        rentalHistory[usuario] = [];
    }
    rentalHistory[usuario].push({ pelicula, duracion, fecha: new Date().toLocaleString() });
    guardarHistorial();
}

function obtenerHistorial(usuario) {
    return rentalHistory[usuario] || [];
}

function mostrarHistorial(usuario) {
    const historial = obtenerHistorial(usuario);
    if (historial.length === 0) {
        console.log('No hay historial de alquiler para este usuario.');
        return;
    }

    historial.forEach(item => {
        console.log(`Película: ${item.pelicula.titulo}, Duración: ${item.duracion} días, Fecha: ${item.fecha}`);
    });
}

function guardarHistorial() {
    localStorage.setItem('rentalHistory', JSON.stringify(rentalHistory));
}

export { agregarHistorial, obtenerHistorial, mostrarHistorial };