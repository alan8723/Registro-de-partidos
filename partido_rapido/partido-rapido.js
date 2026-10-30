// 1. ESTADO (Nuestra "Base de datos" falsa inicial)
let partidos = [];


// Referencias a los elementos del HTML
const formulario = document.getElementById('formulario-partido');
const listaPartidos = document.getElementById('lista-partidos');

const selectorEquipo = document.getElementById('selector-equipo');
const btnCalcularEstadisticas = document.getElementById('btn-calcular-stats');
const contenedorResultado = document.getElementById('resultados-estadisticas');
// 2. LECTURA (Read): Función para pintar los partidos en el HTML


btnCalcularEstadisticas.addEventListener('click', () => {
    const equipo = selectorEquipo.value;

    if (!equipo) {
        alert("elija un quipo");
        return
    }

    const partidosElejidos = partidos.filter(({ local, visitante }) => visitante == equipo || local == equipo);

    let ganados = 0;
    let perdidos = 0;
    let empatados = 0;
    let partidosJugados = partidosElejidos.length


    partidosElejidos.forEach((partidoJugado) => {

        let { local, golesLocal, golesVisitante } = partidoJugado;

        if (local == equipo) {
            if (golesLocal > golesVisitante) {
                ganados += 1
            }
            if (golesLocal == golesVisitante) {
                empatados += 1
            }
            if (golesLocal < golesVisitante) {
                perdidos += 1
            }
        } else {
            if (golesLocal > golesVisitante) {
                perdidos += 1
            }
            if (golesLocal == golesVisitante) {
                empatados += 1
            }
            if (golesLocal < golesVisitante) {
                ganados += 1
            }
        }
    })

    let tasaDeVictoria = (ganados / partidosJugados) * 100

    contenedorResultado.innerHTML = `<p> Los partidos jugados fueron: <strong>${partidosJugados}</strong><br>
  Ganados fueron: <strong> ${ganados}</strong><br>
  Los perdidos fueron: <strong>${perdidos}</strong><br>
  y los empatados: <strong>${empatados} <br>
  la tasa de victoria es de: <strong>${tasaDeVictoria.toFixed(2)}% </p> `;

})





const renderizarPartidos = () => {
    // Limpiamos la lista antes de volver a pintarla para que no se dupliquen
    listaPartidos.innerHTML = '';

    // Usamos forEach (o map) y desestructuramos cada partido
    partidos.forEach(({ id, local, visitante, golesLocal, golesVisitante }) => {
        const li = document.createElement('li');

        // Inyectamos el HTML de cada ítem usando Template Literals
        li.innerHTML = `
      <span>
        <strong>${local}</strong> ${golesLocal} - ${golesVisitante} <strong>${visitante}</strong>
      </span>
      <button class="btn-eliminar" onclick="eliminarPartido(${id})">Eliminar</button>
    `;

        listaPartidos.appendChild(li);
    });
};

// 3. ALTA (Create): Escuchar el evento del formulario
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault(); // Evita que la página se recargue al enviar el form

    // Capturamos los valores
    const nuevoPartido = {
        id: Date.now(), // Generamos un ID único usando la fecha y hora actual en milisegundos
        local: document.getElementById('local').value,
        visitante: document.getElementById('visitante').value,
        golesLocal: parseInt(document.getElementById('goles-local').value),
        golesVisitante: parseInt(document.getElementById('goles-visitante').value)
    };

    // En React, no usamos push(). Creamos un nuevo array combinando el anterior y el nuevo elemento.
    // Esto se logra con el "Spread Operator" (...)
    partidos = [...partidos, nuevoPartido];

    // Actualizamos la vista y limpiamos el formulario
    renderizarPartidos();
    formulario.reset();
});

// 4. BAJA (Delete): Función para borrar
// Se asocia a 'window' para que el HTML la encuentre correctamente en JSFiddle
window.eliminarPartido = (idEliminar) => {
    // Usamos el filter que practicaste: nos quedamos con todos MENOS con el que queremos borrar
    partidos = partidos.filter(({ id }) => id !== idEliminar);

    // Volvemos a pintar la lista actualizada
    renderizarPartidos();
};

// Arrancamos la aplicación pintando los datos iniciales
renderizarPartidos();