import { ipcMain } from 'electron';
import * as io from 'socket.io-client';

let socket;

export default (win, baseUrl) => {
  if (socket) {
    socket.disconnect();
  }

  // IPC channels
  if (!socket) {
    ipcMain.on('set-room', (event, args) => {
      const { date, track, race, model } = args;
      socket.emit('set-room', { date, track, race, model });
      event.sender.send('set-room', {success: 1});
    });
  }

  socket = io(baseUrl);

  // socket channels
  socket.on('connect', () => {
    console.log('Connected to server...');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server ...');
  });

  socket.on('feed', (data) => {
    win.webContents.send('feed', data);
  });

  return socket;
}
