document.getElementById('input-names').addEventListener('click', inputNames);
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('reset-game').addEventListener('click', resetGame);

function inputNames() {
    const numJugadores = parseInt(document.getElementById('num-jugadores').value);
    const jugadoresContainer = document.getElementById('jugadores-container');

    // Limpiar nombres anteriores
    jugadoresContainer.innerHTML = '';

    // Solicitar nombres de jugadores
    for (let i = 1; i <= numJugadores; i++) {
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', `Jugador ${i}`);
        jugadoresContainer.appendChild(input);
    }

    document.getElementById('start-game').disabled = false;
}

function startGame() {
    const jugadoresContainer = document.getElementById('jugadores-container');
    const jugadoresNombres = [];

    // Obtener nombres de los jugadores
    jugadoresContainer.querySelectorAll('input').forEach(input => {
        jugadoresNombres.push(input.value || `Jugador ${jugadoresNombres.length + 1}`);
    });

    const numJugadores = jugadoresNombres.length;

    // Generar tabla de puntuaciones
    generarTabla(numJugadores, jugadoresNombres);

    // Ocultar la selección de jugadores y nombres
    document.getElementById('game-setup').style.display = 'none';
    // Mostrar el botón de resetear partida
    document.getElementById('reset-game').style.display = 'block';
}

function generarTabla(numJugadores, jugadoresNombres) {
    const tableHeaderRow = document.getElementById('header-row');
    const tableBody = document.getElementById('table-body');
    const sumRow = document.getElementById('sum-row');

    // Limpiar contenido anterior
    tableHeaderRow.innerHTML = '';
    tableBody.innerHTML = '';
    sumRow.innerHTML = '';

    // Generar encabezados
    const headers = ['Ronda', 'Acciones', 'Palo', ...jugadoresNombres];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHeaderRow.appendChild(th);
    });

    // Generar filas
    for (let ronda = 1; ronda <= 30; ronda++) {
        const tr = document.createElement('tr');
        
        // Columna de la ronda
        const rondaCell = document.createElement('td');
        rondaCell.textContent = ronda;
        tr.appendChild(rondaCell);

        // Columna de botones (bloquear/resetear)
        const actionsCell = document.createElement('td');
        const lockButton = document.createElement('button');
        lockButton.textContent = '🔒';
        lockButton.classList.add('lock-button');
        lockButton.addEventListener('click', () => lockRound(tr));

        const resetButton = document.createElement('button');
        resetButton.textContent = '🔄';
        resetButton.classList.add('reset-button');
        resetButton.addEventListener('click', () => resetRound(tr));

        actionsCell.appendChild(lockButton);
        actionsCell.appendChild(resetButton);
        tr.appendChild(actionsCell);

        // Columna de selección de palo
        const paloCell = document.createElement('td');
        const paloSelect = document.createElement('select');
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Seleccionar Palo';
        paloSelect.appendChild(emptyOption);

        ['Oros', 'Copas', 'Espadas', 'Bastos'].forEach(palo => {
            const option = document.createElement('option');
            option.value = palo;
            option.textContent = palo;
            paloSelect.appendChild(option);
        });
        paloCell.appendChild(paloSelect);
        tr.appendChild(paloCell);

        // Columnas de puntuación para cada jugador
        for (let i = 0; i < numJugadores; i++) {
            const td = document.createElement('td');
            td.setAttribute('contenteditable', 'true'); // Hacer las celdas editables
            td.addEventListener('input', actualizarSumatorios);
            tr.appendChild(td);
        }

        tableBody.appendChild(tr);
    }

    // Generar fila de sumatorio
    const sumHeader = document.createElement('td');
    sumHeader.textContent = 'Total';
    sumRow.appendChild(sumHeader);
    sumRow.appendChild(document.createElement('td')); // Columna vacía para las acciones
    sumRow.appendChild(document.createElement('td')); // Columna vacía para el palo

    for (let i = 0; i < numJugadores; i++) {
        const sumCell = document.createElement('td');
        sumCell.textContent = '0';
        sumRow.appendChild(sumCell);
    }
}

function actualizarSumatorios() {
    const tableBody = document.getElementById('table-body');
    const sumRow = document.getElementById('sum-row');
    const numJugadores = sumRow.children.length - 3;

    for (let i = 0; i < numJugadores; i++) {
        let sum = 0;
        tableBody.querySelectorAll('tr').forEach(row => {
            const score = parseInt(row.children[i + 3].textContent) || 0;
            sum += score;
        });
        sumRow.children[i + 3].textContent = sum;
    }
}

function lockRound(row) {
    const cells = Array.from(row.children).slice(3);
    const paloSelect = row.children[2].querySelector('select');

    if (cells.some(cell => cell.textContent === '')) {
        alert('Todos los jugadores deben tener una puntuación distinta de 0.');
        return;
    }

    if (paloSelect.value === '') {
        alert('Debes seleccionar un palo antes de bloquear la ronda.');
        return;
    }

    cells.forEach(cell => {
        cell.classList.add('blocked');
        cell.setAttribute('contenteditable', 'false'); // Deshabilitar la edición
    });
    row.querySelector('.reset-button').disabled = true;
}

function resetRound(row) {
    const cells = Array.from(row.children).slice(3);
    const paloSelect = row.children[2].querySelector('select');

    cells.forEach(cell => {
        if (!cell.classList.contains('blocked')) {
            cell.textContent = '0';
            cell.setAttribute('contenteditable', 'true'); // Habilitar la edición
        }
    });

    paloSelect.value = '';
    actualizarSumatorios();
}

function resetGame() {
    // Resetear la tabla y los sumatorios
    const tableBody = document.getElementById('table-body');
    const sumRow = document.getElementById('sum-row');
    tableBody.innerHTML = '';
    sumRow.innerHTML = '';

    // Volver a mostrar las opciones de selección
    document.getElementById('game-setup').style.display = 'block';
    // Ocultar el botón de resetear partida
    document.getElementById('reset-game').style.display = 'none';
}
