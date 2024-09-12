const { app, BrowserWindow, Menu, dialog, ipcMain} = require("electron")
const fs = require('fs')
const { title } = require("process")

let mainWindow;

function createMainWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
    mainWindow.loadFile('index.html')

    const menu = Menu.buildFromTemplate([
        {
            label: 'Archivo',
            submenu: [
                {label: 'Importar', click: () => { openFileDialog() }},
                {label: 'Exportar', click: () => { saveFileDialog() }},
                {label: 'Salir', role: 'quit'}
            ]
        },
        {
            label: 'Editar',
            submenu: [
                {label: 'Deshacer', role: 'undo'},
                {label: 'Rehacer', role: 'redo'},
                {type: 'separator'},
                {label: 'Cortar', role: 'cut'},
                {label: 'Copiar', role: 'copy'},
                {label: 'Pegar', role: 'paste'}
            ]
        },
        {
            label: 'Ayuda',
            submenu: [
                {label: 'Acerca de', click: () => {/*Mostrar dialogo con informacion */}}
            ]
        }
    ])
    Menu.setApplicationMenu(menu)
}




app.whenReady().then( () => {
    createMainWindow()
})
