const btnAddTarea = document.getElementById('add-tarea')
const lista = document.getElementById('lista')
const { ipcRenderer } = require('electron');

// Escuchar cuando el proceso principal solicite las tareas
ipcRenderer.on('solicitar-tareas', () => {
    const tareasArreglo = [];
    document.querySelectorAll('.item').forEach(tarea => {
        tareasArreglo.unshift({
            text: tarea.querySelector('span').textContent,
            completed: tarea.querySelector('.checkbox-tarea').checked
        });
    });
    
    // Enviar las tareas al proceso principal
    ipcRenderer.send('enviar-tareas', tareasArreglo);
});

ipcRenderer.on('tareas-importadas', (event, tareas) => {
    // Limpiar las tareas actuales
    document.querySelectorAll('.item').forEach(tarea => tarea.remove());

    // Cargar las nuevas tareas importadas
    tareas.forEach(tarea => {
        crearNuevaTarea(tarea.text, tarea.completed);
    });

    // Guardar las tareas importadas en localStorage
    guardarTareas();
});


// Función para crear una nueva Tarea
function crearNuevaTarea (textoInput, completed = false){
    const nuevaTarea = document.createElement('li');
    const textoTarea = document.createElement('span');
    textoTarea.textContent = textoInput;

    // Agregar la clase 'tachado' si la tarea está completada
    if (completed) {
        textoTarea.classList.add('tachado');  // Añadir la clase 'tachado' si la tarea está completada
    }
    
    textoTarea.setAttribute('class', 'linea');
    nuevaTarea.setAttribute('class', 'item');
    nuevaTarea.appendChild(textoTarea);
    
    // Para cada nuevaTarea que creamos, creamos sus botones con su propia funcionalidad
    const btnMarcarTarea = marcarTarea(textoTarea, completed);
    const btnEliminar = eliminarTarea(lista, nuevaTarea);
    const btnEditarTarea = editarTarea(textoTarea, nuevaTarea, btnMarcarTarea, btnEliminar);
    
    // Añadir los botones a la nueva tarea como hijos
    nuevaTarea.append(btnEditarTarea, btnEliminar, btnMarcarTarea);
    
    // Insertar la nueva tarea al inicio de la lista
    lista.insertAdjacentElement('afterbegin', nuevaTarea);
}

// Función para Incluir Botón de Marcar Tareas y su funcionamiento
function marcarTarea(textoTarea, completed = false) {
    const btnMarcarTarea = document.createElement('input');
    btnMarcarTarea.type = 'checkbox';
    btnMarcarTarea.className = 'checkbox-tarea';
    btnMarcarTarea.checked = completed;

    // Verifica si la tarea está completada al cargar y aplica la clase 'tachado' si corresponde
    if (completed) {
        textoTarea.classList.add('tachado');
    }

    // Escuchar el click en el checkbox
    btnMarcarTarea.addEventListener('click', () => {
        if (btnMarcarTarea.checked) {
            // Aplicar la clase 'tachado' cuando se marca como completada
            textoTarea.classList.add('tachado');
            
            // Notificación de tarea completada
            const notificacion = new Notification('Tarea Completada', {
                body: `La tarea ${textoTarea.textContent} ha sido completada. ¡Muy Bien!`,
                silent: false
            });
            notificacion.onclick = () => {
                console.log('Notificación de tarea completada clickeada');
            };
        } else {
            // Remover la clase 'tachado' cuando se desmarca la tarea
            textoTarea.classList.remove('tachado');
        }
        guardarTareas();
    });
    return btnMarcarTarea;
}

//Función para Incluir Botón de Eliminar Tareas y su funcionamiento
function eliminarTarea(lista, nuevaTarea) {
    const btnEliminar = document.createElement('button')
        //Este boton es distinto al resto ya que le aplicammos un icono de iconFolder para hacerlo más intuitivo para el usuario
        btnEliminar.innerHTML = '<i class="fas fa-trash-alt"></i>'
        btnEliminar.addEventListener('click', ()=>{
            //Al hacer click sobre el icono del cesto de basura, se estará eliminando por completo 'nuevaTarea' de 'lista'
            //Siendo 'nuevaTarea' la tarea seleccionada por el usuario
            lista.removeChild(nuevaTarea)
            guardarTareas()
        })
    return btnEliminar
}

// Función para Incluir Botón de Editar Tarea y su funcionamiento
function editarTarea(textoTarea, nuevaTarea, btnMarcarTarea, btnEliminar) {
    const btnEditarTarea = document.createElement('button')
        btnEditarTarea.textContent = 'Editar'
        btnEditarTarea.addEventListener('click', ()=>{
            if (btnEditarTarea.textContent === 'Editar'){

                //Al hacerse click sobre el boton 'Editar', el 'Span' de texto será reemplazado por un 'input' al que se le asignará el valor que tenía el
                //elemento 'Span' antes de ser reemplazado.
                const inputEdit = document.createElement('input')
                inputEdit.value = textoTarea.textContent
                nuevaTarea.replaceChild(inputEdit,textoTarea)
                
                btnEditarTarea.textContent = 'Guardar'
                nuevaTarea.removeChild(btnMarcarTarea)
                
                const btnCancelar = document.createElement('button')
                btnCancelar.textContent = 'Cancelar'
                nuevaTarea.replaceChild(btnCancelar, btnEliminar)

                //El boton 'Editar' será reemplazado por un boton llamado 'Guardar'
                //Mientras que los botones 'Eliminar' y 'MarcarTarea' seran reemplazados por un boton 'Cancelar'. Que permita deshacer los cambios de la edicion
                //y volver a su estado anterior

                btnCancelar.addEventListener('click', ()=>{
                    nuevaTarea.replaceChild(textoTarea, inputEdit)
                    nuevaTarea.replaceChild(btnEliminar,btnCancelar)
                    btnEditarTarea.textContent = 'Editar'
                    nuevaTarea.appendChild(btnMarcarTarea)
                })
                
                btnEditarTarea.addEventListener('click', ()=>{
                    const inputValidado = inputEdit.value
                    if (inputValidado){
                        textoTarea.textContent = inputValidado
                        nuevaTarea.replaceChild(textoTarea, inputEdit)
                        nuevaTarea.replaceChild(btnEliminar,btnCancelar)
                        btnEditarTarea.textContent = 'Editar'
                        nuevaTarea.appendChild(btnMarcarTarea)
                        guardarTareas()
                    }
                }, { once: true });
            }
        })
        return btnEditarTarea
}

// Función para guardar las tareas en localStorage
function guardarTareas() {
    const tareasArreglo = [];
    // Recorre todas las tareas visibles en el DOM
    document.querySelectorAll('.item').forEach(tarea => {
        tareasArreglo.unshift({
            text: tarea.querySelector('span').textContent,  // Texto de la tarea
            completed: tarea.querySelector('.checkbox-tarea').checked  // Estado de completado
        });
    });
    // Guarda el array de tareas en localStorage
    localStorage.setItem('tareas', JSON.stringify(tareasArreglo));
}
// Función para cargar las tareas desde localStorage
function cargarTareas() {
    const tareasArreglo = JSON.parse(localStorage.getItem('tareas')) || []
    tareasArreglo.forEach(tarea => {
        crearNuevaTarea(tarea.text ,tarea.completed)
    })
}

window.addEventListener('DOMContentLoaded', cargarTareas)

btnAddTarea.addEventListener('click', ()=>{
    const inputTarea = document.getElementById('input-tarea')
    const textoInput = inputTarea.value

    if (textoInput){
        crearNuevaTarea(textoInput)
        inputTarea.value = ""
        guardarTareas()
    }
})