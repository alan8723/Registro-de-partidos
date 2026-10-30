let torneo = [];

const btnCrear = document.getElementById('btn-crear');
const contenedorLlaves = document.getElementById('contenedor-llaves');

// Función matemática para saber el nombre de la ronda
const obtenerNombreRonda = (numPartidos) => {
  if (numPartidos === 8) return "Octavos de Final";
  if (numPartidos === 4) return "Cuartos de Final";
  if (numPartidos === 2) return "Semifinales";
  if (numPartidos === 1) return "Gran Final";
  return "Campeón";
};

// 2. CREAR LA ESTRUCTURA VACÍA
btnCrear.addEventListener('click', () => {
  const numEquipos = parseInt(document.getElementById('num-equipos').value);
  const totalRondas = Math.log2(numEquipos); // Si son 8 equipos, son 3 rondas (2^3)

  torneo = []; // Vaciamos el torneo anterior

  // Armamos la estructura de arrays
  for (let r = 0; r < totalRondas; r++) {
    let partidosEnEstaRonda = numEquipos / Math.pow(2, r + 1);
    let rondaActual = [];

    for (let p = 0; p < partidosEnEstaRonda; p++) {
      rondaActual.push({
        id: `R${r}-P${p}`,
        equipo1: r === 0 ? `Equipo ${p * 2 + 1}` : "", // Solo rellenamos nombres en la 1ra ronda
        equipo2: r === 0 ? `Equipo ${p * 2 + 2}` : "",
        goles1: "",
        goles2: ""
      });
    }
    torneo.push(rondaActual);
  }

  renderizarLlaves();
});

// 3. ACTUALIZAR EL ESTADO (Cuando cambias un input de texto o número)
window.actualizarDato = (rondaIndex, partidoIndex, campo, valor) => {
  torneo[rondaIndex][partidoIndex][campo] = valor;
};

// 4. LÓGICA DE AVANZAR (La magia del fixture)
window.avanzarGanador = (rondaIndex, partidoIndex) => {
  const partido = torneo[rondaIndex][partidoIndex];

  // Validaciones
  if (partido.goles1 === "" || partido.goles2 === "") {
    alert("Faltan ingresar los goles."); return;
  }
  if (partido.goles1 === partido.goles2) {
    alert("¡No puede haber empates en eliminación directa! (Suma penales a los goles)"); return;
  }

  // Determinar ganador
  const ganador = parseInt(partido.goles1) > parseInt(partido.goles2) ? partido.equipo1 : partido.equipo2;

  // ¿Hay una ronda siguiente?
  if (rondaIndex + 1 < torneo.length) {
    // Calculamos a qué partido de la siguiente ronda va (índice actual dividido 2)
    const proximoPartidoIndex = Math.floor(partidoIndex / 2);
    const esEquipo1 = partidoIndex % 2 === 0; // Si el índice es par, va arriba. Si es impar, va abajo.

    if (esEquipo1) {
      torneo[rondaIndex + 1][proximoPartidoIndex].equipo1 = ganador;
    } else {
      torneo[rondaIndex + 1][proximoPartidoIndex].equipo2 = ganador;
    }
    renderizarLlaves(); // Volvemos a pintar todo con el ganador avanzado
  } else {
    alert(`🏆 ¡${ganador.toUpperCase()} ES EL CAMPEÓN DEL TORNEO! 🏆`);
  }
};

// 5. DIBUJAR EN PANTALLA (Render)
const renderizarLlaves = () => {
  contenedorLlaves.innerHTML = ''; // Limpiamos el HTML viejo

  // Recorremos cada ronda (Columna)
  torneo.forEach((ronda, rondaIndex) => {
    const divColumna = document.createElement('div');
    divColumna.className = 'ronda-columna';

    const titulo = document.createElement('div');
    titulo.className = 'ronda-titulo';
    titulo.innerText = obtenerNombreRonda(ronda.length);
    divColumna.appendChild(titulo);

    // Recorremos cada partido de la ronda (Cajitas)
    ronda.forEach((partido, partidoIndex) => {
      const divPartido = document.createElement('div');
      divPartido.className = 'partido-box';

      // Habilitar inputs solo si la ronda anterior ya definió a este equipo
      const disableEq1 = partido.equipo1 === "" ? "disabled" : "";
      const disableEq2 = partido.equipo2 === "" ? "disabled" : "";

      divPartido.innerHTML = `
        <div class="equipo-fila">
          <input type="text" class="input-nombre" value="${partido.equipo1}" 
            onchange="actualizarDato(${rondaIndex}, ${partidoIndex}, 'equipo1', this.value)" 
            ${rondaIndex !== 0 ? 'readonly' : ''} placeholder="Por definir">
            
          <input type="number" class="input-goles" value="${partido.goles1}" 
            onchange="actualizarDato(${rondaIndex}, ${partidoIndex}, 'goles1', this.value)" 
            ${disableEq1}>
        </div>
        <div class="equipo-fila">
          <input type="text" class="input-nombre" value="${partido.equipo2}" 
            onchange="actualizarDato(${rondaIndex}, ${partidoIndex}, 'equipo2', this.value)" 
            ${rondaIndex !== 0 ? 'readonly' : ''} placeholder="Por definir">
            
          <input type="number" class="input-goles" value="${partido.goles2}" 
            onchange="actualizarDato(${rondaIndex}, ${partidoIndex}, 'goles2', this.value)" 
            ${disableEq2}>
        </div>
        <button class="btn-avanzar" onclick="avanzarGanador(${rondaIndex}, ${partidoIndex})">✔ Avanzar Ganador</button>
      `;
      divColumna.appendChild(divPartido);
    });

    contenedorLlaves.appendChild(divColumna);
  });
};

// Autoclick al iniciar para que no aparezca en blanco
btnCrear.click();