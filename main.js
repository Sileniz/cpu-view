const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const os = require('node:os')
const fs = require('fs').promises
const userDataPath = app.getPath('userData');
let win;
let isMac = process.platform === 'darwin'

async function createWindow(){
  win = new BrowserWindow({
    width: 400,
    height: 550,
    resizable: false,
    autoHideMenuBar: true,
    transparent: true, 
    webPreferences:{
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  })
  await win.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0){
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if(!isMac) app.quit()
})

ipcMain.handle('get-system-info', () => {
  return {
    host: os.hostname(),
    cpus: os.cpus(),
    ram: os.totalmem(),
    uptime: os.uptime(),
    os: os.type(),
    arch: os.arch()
  }
})

ipcMain.handle('upload-img', async (event, filePath, newExtension) => {
  if (typeof filePath !== 'string') {
    throw new Error('filePath deve ser uma string');
  }
  if (typeof newExtension !== 'string') {
    throw new Error('newExtension deve ser uma string');
  }

  const extname = path.extname(filePath);
  const basename = path.basename(filePath, extname);
  const newFileName = `${basename}${newExtension}`;
  const destPath = path.join(userDataPath, '/assets', newFileName);

  try {
    await fs.copyFile(filePath, destPath);
    return destPath; 
  } catch (err) {
    console.error('Erro ao copiar arquivo:', err);
    throw err; 
  }
});



ipcMain.handle('read-dir', async () => {
  const directory = path.join(userDataPath, '/assets');

  try {
    await fs.access(directory);
  } catch {

    await fs.mkdir(directory, { recursive: true });
  }

  // Ler o conteúdo do diretório
  const result = await fs.readdir(directory);

  // Definir formatos válidos e verificar se algum arquivo é válido
  const validFormats = ['profile.jpg', 'profile.png', 'profile.jpeg'];
  const hasValidFormat = result.some(item => validFormats.includes(item));

  if (hasValidFormat) {
    const newArray = result.filter(item => validFormats.includes(item));
    return path.join(directory, newArray[0]);
  }
  
  return false;
});
