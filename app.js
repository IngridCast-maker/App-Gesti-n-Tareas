// Error Card 3 & 9: Uso de POO y código modularizado
class Tarea {
    constructor(nombre) {
        this.id = Date.now().toString(); // ID único para identificar la tarea
        this.nombre = nombre;
        this.completa = false;
    }

    completar() {
        this.completa = !this.completa;
    }
}

class GestorDeTareas {
    constructor() {
        // Error Card 4: Uso correcto de const y let
        this.tareas = this.cargarTareas();
        this.inputTarea = document.getElementById('nueva-tarea');
        this.btnAgregar = document.getElementById('agregar-tarea');
        this.listaTareas = document.getElementById('lista-tareas');
        this.mensajeError = document.getElementById('mensaje-error');

        this.inicializarEventos();
        this.render();
    }

    // Error Card 6: Implementación correcta de LocalStorage
    cargarTareas() {
        const tareasGuardadas = localStorage.getItem('tareas');
        return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
    }

    guardarTareas() {
        localStorage.setItem('tareas', JSON.stringify(this.tareas));
    }

    // Error Card 8: Delegación de eventos para botones dinámicos
    inicializarEventos() {
        this.btnAgregar.addEventListener('click', () => this.agregarTarea());
        
        this.inputTarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.agregarTarea();
        });

        // Delegación de eventos en la lista (ul)
        this.listaTareas.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li) return;
            const id = li.dataset.id;

            if (e.target.classList.contains('btn-eliminar')) {
                this.eliminarTarea(id);
            } else if (e.target.classList.contains('btn-editar')) {
                this.editarTarea(id);
            } else if (e.target.classList.contains('btn-completar')) {
                this.completarTarea(id);
            }
        });
    }

    // Error Card 5: Validación de entrada del usuario
    agregarTarea() {
        const nombre = this.inputTarea.value.trim();

        if (nombre === '') {
            this.mostrarError('La tarea no puede estar vacía.');
            return;
        }

        if (this.tareas.some(t => t.nombre.toLowerCase() === nombre.toLowerCase())) {
            this.mostrarError('Esta tarea ya existe.');
            return;
        }

        const tarea = new Tarea(nombre);
        this.tareas.push(tarea);
        this.guardarTareas();
        this.render();
        
        this.inputTarea.value = '';
        this.ocultarError();
    }

    eliminarTarea(id) {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardarTareas();
        this.render();
    }

    editarTarea(id) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            const nuevoNombre = prompt('Editar tarea:', tarea.nombre);
            if (nuevoNombre !== null && nuevoNombre.trim() !== '') {
                tarea.nombre = nuevoNombre.trim();
                this.guardarTareas();
                this.render();
            } else if (nuevoNombre !== null) {
                this.mostrarError('El nombre de la tarea no puede estar vacío.');
            }
        }
    }

    completarTarea(id) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            tarea.completar();
            this.guardarTareas();
            this.render();
        }
    }

    mostrarError(mensaje) {
        this.mensajeError.textContent = mensaje;
    }

    ocultarError() {
        this.mensajeError.textContent = '';
    }

    // Error Card 2: Manipulación correcta del DOM
    render() {
        this.listaTareas.innerHTML = '';
        
        // Error Card 4: Uso de forEach y template literals (ES6+)
        this.tareas.forEach(tarea => {
            const li = document.createElement('li');
            li.dataset.id = tarea.id; // Atributo data-id para identificar tareas
            if (tarea.completa) li.classList.add('completa');

            li.innerHTML = `
                <button class="btn-completar" style="margin-right:10px; background:none; color:black; font-size:1.2rem;">
                    ${tarea.completa ? '✅' : '⬜'}
                </button>
                <span class="tarea-texto" style="flex:1;">${tarea.nombre}</span>
                <div class="acciones">
                    <button class="btn-editar">Editar</button>
                    <button class="btn-eliminar">Eliminar</button>
                </div>
            `;
            this.listaTareas.appendChild(li);
        });
    }
}

// Instanciar la clase cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    new GestorDeTareas();
});