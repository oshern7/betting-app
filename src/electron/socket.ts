import { ipcMain } from 'electron';
import * as io from 'socket.io-client';
import { BASE_URL } from './api';

export default (win) => {
  const socket = io(BASE_URL);

  // socket channels
  socket.on('connect', () => {
    console.log('Connected to server...');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server ...');
  });

  socket.on('feed', (data) => {
    console.log('Get feed', data)
    win.webContents.send('feed', data);
  });

  // IPC channels
  ipcMain.on('set-room', (event, args) => {
    const { date, track, race, model } = args;
    socket.emit('set-room', { date, track, race, model });
    event.sender.send('set-room', {success: 1});
  });

  return socket;
}
