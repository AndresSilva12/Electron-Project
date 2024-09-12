const {ipcRenderer} = require('electron')

const btnAddTarea = document.getElementById('add-tarea')
const lista = document.getElementById('lista')

// Función para crear una nueva Tarea
function crearNuevaTarea (textoInput, completed = false){
    const nuevaTarea = document.createElement('li')
        const textoTarea = document.createElement('span')
        textoTarea.textContent = textoInput
        textoTarea.style.textDecoration = completed ? 'line-through' : 'none'
        textoTarea.setAttribute('class', 'linea')
        nuevaTarea.setAttribute('class', 'item')
        nuevaTarea.appendChild(textoTarea)
        
        const btnMarcarTarea = marcarTarea(textoTarea, completed)
        const btnEliminar = eliminarTarea(lista, nuevaTarea)
        const btnEditarTarea = editarTarea(textoTarea, nuevaTarea, btnMarcarTarea, btnEliminar)

        nuevaTarea.append(btnEditarTarea,btnEliminar,btnMarcarTarea)
        lista.insertAdjacentElement('afterbegin', nuevaTarea)
}

// Función para Incluir Botón de Marcar Tareas y su funcionamiento
function marcarTarea(textoTarea, completed = false) {
    const btnMarcarTarea = document.createElement('input')
        btnMarcarTarea.type = 'checkbox'
        btnMarcarTarea.className = 'checkbox-tarea'
        btnMarcarTarea.checked = completed

        btnMarcarTarea.addEventListener('click', ()=>{
            if (btnMarcarTarea.checked){
                textoTarea.classList.add('tachado')
                const notificacion = new Notification('Tarea Completada',{
                    body: `La tarea ${textoTarea.textContent} ha sido completada. ¡Muy Bien!`,
                    silent: false
                })
                notificacion.onclick = () => {
                    console.log('Notificacion de tarea completada clickeada')
                }
            }else{
                textoTarea.classList.remove('tachado')
            }
            guardarTareas();
        })
    return btnMarcarTarea;
}

//Función para Incluir Botón de Eliminar Tareas y su funcionamiento
function eliminarTarea(lista, nuevaTarea) {
    const btnEliminar = document.createElement('button')
        btnEliminar.innerHTML = '<i class="fas fa-trash-alt"></i>'
        btnEliminar.addEventListener('click', ()=>{
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

                const inputEdit = document.createElement('input')
                inputEdit.value = textoTarea.textContent
                nuevaTarea.replaceChild(inputEdit,textoTarea)
                
                btnEditarTarea.textContent = 'Guardar'
                nuevaTarea.removeChild(btnMarcarTarea)
                
                const btnCancelar = document.createElement('button')
                btnCancelar.textContent = 'Cancelar'
                nuevaTarea.replaceChild(btnCancelar, btnEliminar)

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