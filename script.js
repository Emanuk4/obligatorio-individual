let equipos = []; // Array para almacenar los equipos
let torneo = []; // Array para almacenar las rondas del torneo
let equiposEliminados = []; // Array para almacenar equipos eliminados

// Función para agregar un equipo al array
function agregarEquipo() {
  let nombreEquipo = document.getElementById('nombre').value.trim();
  let ciudadEquipo = document.getElementById('ciudad').value.trim();
  let fechaEquipo = document.getElementById('fecha').value;
  
  if (nombreEquipo === '' || ciudadEquipo === '' || fechaEquipo === '') {
    alert('Por favor completa todos los campos.');
    return;
  }

  let equipo = {
    nombre: nombreEquipo,
    ciudad: ciudadEquipo,
    fecha: fechaEquipo
  };

  equipos.push(equipo);
  actualizarListaEquipos();
  limpiarFormulario();
}

// Función para limpiar el formulario después de agregar un equipo
function limpiarFormulario() {
  document.getElementById('nombre').value = '';
  document.getElementById('ciudad').value = '';
  document.getElementById('fecha').value = '';
}

// Función para eliminar un equipo del array
function eliminarEquipo(index) {
  equipos.splice(index, 1);
  actualizarListaEquipos();
  // Si hay equipos asignados, volver a asignar equipos a grupos después de eliminar
  if (document.getElementById('grupos').children.length > 0) {
    asignarEquiposAGrupos();
  }
}

// Función para actualizar la lista de equipos en el HTML
function actualizarListaEquipos() {
  let listaEquipos = document.getElementById('lista-equipos');
  listaEquipos.innerHTML = '';
  equipos.forEach((equipo, index) => {
    let li = document.createElement('li');
    li.textContent = `${equipo.nombre} - ${equipo.ciudad} - ${equipo.fecha}`;

    let buttonEliminar = document.createElement('button');
    buttonEliminar.textContent = 'Eliminar';
    buttonEliminar.onclick = function() { eliminarEquipo(index); };
    
    li.appendChild(buttonEliminar);
    listaEquipos.appendChild(li);
  });
}

// Función para asignar equipos aleatoriamente a los grupos
function asignarEquiposAGrupos() {
  let tamanoGrupo = parseInt(document.getElementById('tamano-grupo').value);
  if (isNaN(tamanoGrupo) || tamanoGrupo <= 0) {
    alert('Por favor ingresa un tamaño válido para los grupos.');
    return;
  }

  // Verificar si hay suficientes equipos para formar al menos un grupo
  if (equipos.length < tamanoGrupo) {
    alert('Cantidad de equipos insuficiente para formar al menos un grupo.');
    return;
  }

  // Lógica para asignar equipos a grupos aleatoriamente
  let gruposAsignados = {};

  // Copiar el array de equipos para no modificar el original
  let equiposDisponibles = [...equipos];

  // Generar grupos hasta que no haya equipos suficientes para un nuevo grupo
  let indiceGrupo = 1;
  while (equiposDisponibles.length >= tamanoGrupo) {
    let grupo = `Grupo ${indiceGrupo}`;
    gruposAsignados[grupo] = [];

    // Agregar equipos aleatorios al grupo
    for (let i = 0; i < tamanoGrupo; i++) {
      // Generar un índice aleatorio dentro de los equipos disponibles
      let index = Math.floor(Math.random() * equiposDisponibles.length);
      // Agregar el equipo seleccionado al grupo
      gruposAsignados[grupo].push(equiposDisponibles[index]);
      // Eliminar el equipo seleccionado de los disponibles para evitar repeticiones
      equiposDisponibles.splice(index, 1);
    }

    indiceGrupo++;
  }

  // Guardar los grupos asignados en el array de torneo (para manejar las rondas)
  torneo.push(gruposAsignados);

  // Mostrar los grupos asignados en el HTML
  let gruposDiv = document.getElementById('grupos');
  gruposDiv.innerHTML = '';

  for (let grupo in gruposAsignados) {
    if (gruposAsignados.hasOwnProperty(grupo)) {
      let h4 = document.createElement('h4');
      h4.textContent = `${grupo}:`;
      gruposDiv.appendChild(h4);

      let ul = document.createElement('ul');
      gruposAsignados[grupo].forEach(equipo => {
        let li = document.createElement('li');
        li.textContent = `${equipo.nombre} - ${equipo.ciudad} - ${equipo.fecha}`;
        ul.appendChild(li);
      });
      gruposDiv.appendChild(ul);
    }
  }

  // Mostrar los enfrentamientos de la primera ronda del torneo
  mostrarRonda(0);
}

// Función para generar partidos entre equipos de un grupo
function generarPartidos(equiposGrupo) {
  let partidos = [];
  for (let i = 0; i < equiposGrupo.length - 1; i++) {
    for (let j = i + 1; j < equiposGrupo.length; j++) {
      let partido = {
        equipoA: equiposGrupo[i],
        equipoB: equiposGrupo[j]
      };
      partidos.push(partido);
    }
  }
  return partidos;
}

// Función para mostrar los enfrentamientos de una ronda del torneo
function mostrarRonda(indiceRonda) {
  let torneoDiv = document.getElementById('torneo');
  torneoDiv.innerHTML = '';

  let ronda = torneo[indiceRonda];
  for (let grupo in ronda) {
    if (ronda.hasOwnProperty(grupo)) {
      let h4 = document.createElement('h4');
      h4.textContent = `${grupo}:`;
      torneoDiv.appendChild(h4);

      let partidos = generarPartidos(ronda[grupo]);
      let ul = document.createElement('ul');
      partidos.forEach(partido => {
        let li = document.createElement('li');
        li.textContent = `${partido.equipoA.nombre} vs ${partido.equipoB.nombre}`;
        ul.appendChild(li);
      });
      torneoDiv.appendChild(ul);

      // Agregar botones de eliminar equipo en el torneo
      ronda[grupo].forEach(equipo => {
        let buttonEliminar = document.createElement('button');
        buttonEliminar.textContent = `Eliminar ${equipo.nombre}`;
        buttonEliminar.onclick = function() {
          eliminarEquipoDelTorneo(equipo, indiceRonda);
        };
        torneoDiv.appendChild(buttonEliminar);
      });
    }
  }

  // Mostrar botón para avanzar a la siguiente ronda si es posible
  if (indiceRonda < torneo.length - 1) {
    let buttonSiguienteRonda = document.createElement('button');
    buttonSiguienteRonda.textContent = 'Siguiente Ronda';
    buttonSiguienteRonda.onclick = function() { mostrarRonda(indiceRonda + 1); };
    torneoDiv.appendChild(buttonSiguienteRonda);
  } else {
    // Mostrar clasificación final del torneo
    mostrarClasificacion();
  }
}

// Función para mostrar la clasificación final del torneo
function mostrarClasificacion() {
  let clasificacionDiv = document.createElement('div');
  clasificacionDiv.innerHTML = '<h3>Clasificación Final del Torneo:</h3>';

  // Ordenar equipos eliminados por ronda de eliminación ascendente
  equiposEliminados.sort((a, b) => a.rondaEliminacion - b.rondaEliminacion);

  equiposEliminados.forEach(equipo => {
    let p = document.createElement('p');
    p.textContent = `${equipo.nombre} - ${equipo.ciudad} - Eliminado en Ronda ${equipo.rondaEliminacion}`;
    clasificacionDiv.appendChild(p);
  });

  let torneoDiv = document.getElementById('torneo');
  torneoDiv.appendChild(clasificacionDiv);
}

// Función para eliminar un equipo del torneo
function eliminarEquipoDelTorneo(equipo, ronda) {
  // Encontrar el grupo y el índice del equipo dentro del torneo
  for (let grupo in torneo[ronda]) {
    if (torneo[ronda].hasOwnProperty(grupo)) {
      let index = torneo[ronda][grupo].findIndex(e => e.nombre === equipo.nombre);
      if (index !== -1) {
        // Eliminar el equipo del grupo en la ronda específica del torneo
        torneo[ronda][grupo].splice(index, 1);
        // Mostrar la siguiente ronda actualizada
        mostrarRonda(ronda);
        return;
      }
    }
  }
}