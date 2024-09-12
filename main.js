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
                {label: 'Importar', click: openFileDialog },
                {label: 'Exportar', click: saveFileDialog },
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

// Función para exportar las tareas a un archivo
function saveFileDialog() {
    const window = BrowserWindow.getFocusedWindow(); // Obtener la ventana activa
    dialog.showSaveDialog({
        title: 'Guardar lista de tareas',
        defaultPath: 'tareas.json',
        filters: [
            { name: 'JSON Files', extensions: ['json'] }
        ]
    }).then(result => {
        if (!result.canceled && result.filePath) {
            // Solicitar las tareas desde el proceso de renderizado
            window.webContents.send('solicitar-tareas');
            ipcMain.once('enviar-tareas', (event, tareas) => {
                // Escribir las tareas en el archivo
                fs.writeFileSync(result.filePath, JSON.stringify(tareas, null, 2), 'utf-8');
                console.log('Tareas exportadas exitosamente');
            });
        }
    }).catch(err => {
        console.error('Error al guardar el archivo:', err);
    });
}

// Función para importar tareas desde un archivo
function openFileDialog() {
    const window = BrowserWindow.getFocusedWindow(); // Obtener la ventana activa
    dialog.showOpenDialog({
        title: 'Seleccionar archivo de tareas',
        filters: [
            { name: 'JSON Files', extensions: ['json'] }
        ],
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            const data = fs.readFileSync(result.filePaths[0], 'utf-8');
            const tareas = JSON.parse(data);
            // Enviar las tareas al proceso de renderizado
            window.webContents.send('tareas-importadas', tareas);
        }
    }).catch(err => {
        console.error('Error al cargar el archivo:', err);
    });
}
