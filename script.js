let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let editandoId = null;
let grafica;

// ---------- Toggle de secciones ----------

function toggleGrafica() {
  const graficaSection = document.getElementById('graficaSection');
  const reporteSection = document.getElementById('reporteSection');
  const crudContainer = document.querySelector('.crud-container');

  if (graficaSection.classList.contains('show')) {
    graficaSection.classList.remove('show');
    crudContainer.style.display = 'block';
  } else {
    reporteSection.classList.remove('show');
    crudContainer.style.display = 'none';
    generarGrafica();
    graficaSection.classList.add('show');
  }
}

function toggleReporte() {
  const reporteSection = document.getElementById('reporteSection');
  const graficaSection = document.getElementById('graficaSection');
  const crudContainer = document.querySelector('.crud-container');

  if (reporteSection.classList.contains('show')) {
    reporteSection.classList.remove('show');
    crudContainer.style.display = 'block';
  } else {
    graficaSection.classList.remove('show');
    crudContainer.style.display = 'none';
    generarReporte();
    reporteSection.classList.add('show');
  }
}

// ---------- Gráfica ----------

function generarGrafica() {
  const ctx = document.getElementById('myChart').getContext('2d');

  const labels = usuarios.map(u => u.nombre);
  const datos = usuarios.map(() => 1);

  if (grafica) {
    grafica.destroy();
  }

  grafica = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.length ? labels : ['Sin usuarios'],
      datasets: [{
        label: 'Usuarios Registrados',
        data: datos.length ? datos : [0],
        backgroundColor: 'rgba(0, 255, 255, 0.5)',
        borderColor: 'rgba(255, 0, 255, 0.8)',
        borderWidth: 1.5,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: '#fff'
          },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        x: {
          ticks: { color: '#fff' },
          grid: { display: false }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Usuarios Registrados',
          color: '#00ffff'
        }
      }
    }
  });
}

// ---------- Reporte ----------

function generarReporte() {
  const total = usuarios.length;

  document.getElementById('resumenReporte').innerHTML = `
    <div class="resumen-card">
      <div class="valor">${total}</div>
      <div class="etiqueta">Usuarios registrados</div>
    </div>
  `;

  const tbody = document.querySelector('#tablaReporte tbody');
  tbody.innerHTML = '';

  if (total === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="text-center">No hay usuarios registrados</td></tr>';
  } else {
    usuarios.forEach((u, index) => {
      tbody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${u.nombre}</td>
          <td>${u.email}</td>
        </tr>
      `;
    });
  }
}

// ---------- CRUD ----------

function mostrar() {
  const tbody = document.getElementById('tablaUsuarios');
  tbody.innerHTML = '';

  if (usuarios.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay usuarios registrados</td></tr>';
    return;
  }

  usuarios.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td>${u.nombre}</td>
        <td>${u.email}</td>
        <td>
          <button class="btn btn-edit" onclick="editar(${u.id})">Editar</button>
          <button class="btn btn-delete" onclick="eliminar(${u.id})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

function guardar() {
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!nombre || !email) {
    alert('Completa todos los campos');
    return;
  }

  if (editandoId === null) {
    // CREATE
    const nuevo = {
      id: Date.now(),
      nombre: nombre,
      email: email
    };
    usuarios.push(nuevo);
  } else {
    // UPDATE
    usuarios = usuarios.map(u =>
      u.id === editandoId ? { ...u, nombre, email } : u
    );
    editandoId = null;
    document.getElementById('formTitle').innerText = 'Agregar Usuario';
  }

  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  limpiar();
  mostrar();
}

function editar(id) {
  const user = usuarios.find(u => u.id === id);
  if (!user) return;

  document.getElementById('nombre').value = user.nombre;
  document.getElementById('email').value = user.email;
  editandoId = id;
  document.getElementById('formTitle').innerText = 'Editar Usuario';
}

function eliminar(id) {
  if (confirm('¿Eliminar este usuario?')) {
    // DELETE
    usuarios = usuarios.filter(u => u.id !== id);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    mostrar();
  }
}

function limpiar() {
  document.getElementById('nombre').value = '';
  document.getElementById('email').value = '';
}

// READ - cargar al inicio
mostrar();
