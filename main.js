const { app, BrowserWindow} = require("electron")

function createMainWindow () {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })
    mainWindow.loadFile('index.html')
}


app.whenReady().then( () => {
    createMainWindow()
})