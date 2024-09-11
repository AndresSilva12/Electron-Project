const btnAddTarea = document.getElementById('add-tarea')
const lista = document.getElementById('lista')

btnAddTarea.addEventListener('click', ()=>{
    const inputTarea = document.getElementById('input-tarea')
    const textoInput = inputTarea.value

    if (textoInput){
        const nuevaTarea = document.createElement('li')
        const textoTarea = document.createElement('span')
        textoTarea.textContent = textoInput
        textoTarea.style.textDecoration = "none"
        textoTarea.setAttribute('class', 'linea')
        nuevaTarea.setAttribute('class', 'item')
        nuevaTarea.appendChild(textoTarea)
        
        const btnMarcarTarea = document.createElement('input')
        btnMarcarTarea.type = 'checkbox'
        btnMarcarTarea.className = 'checkbox-tarea'

        btnMarcarTarea.addEventListener('click', ()=>{
            if (btnMarcarTarea.checked){
                textoTarea.classList.add('tachado')
            }else{
                textoTarea.classList.remove('tachado')
            }
        })

        const btnEliminar = document.createElement('button')
        btnEliminar.innerHTML = '<i class="fas fa-trash-alt"></i>'
        // btnEliminar.textContent = "Eliminar"
        btnEliminar.addEventListener('click', ()=>{
            lista.removeChild(nuevaTarea)
        })

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
                    }
                }, { once: true });
            }
        })

        nuevaTarea.append(btnEditarTarea,btnEliminar,btnMarcarTarea)
        lista.insertAdjacentElement('afterbegin', nuevaTarea)
        inputTarea.value = ""
    }
})