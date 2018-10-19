import { ipcMain } from 'electron';
import { getTracks, getRacesByTrack, getModels } from './api';
import initSocket from './socket';

export default (win) => {
  ipcMain.on('get-tracks', async (event, args) => {
    try {
      const { tracks } = await getTracks();
      event.sender.send('get-tracks', { success: 1, tracks });
    } catch (err) {
      console.log(err);
      event.sender.send('get-tracks', { success: 0, err: err.message });
    }
  });

  ipcMain.on('get-races', async (event, args) => {
    try {
      const { races } = await getRacesByTrack(args.track);
      event.sender.send('get-races', { success: 1, races });
    } catch (err) {
      console.log(err);
      event.sender.send('get-races', { success: 0, err: err.message });
    }
  });

  ipcMain.on('get-models', async (event, args) => {
    try {
      const { models } = await getModels();
      event.sender.send('get-models', { success: 1, models });
    } catch (err) {
      console.log(err);
      event.sender.send('get-models', { success: 0, err: err.message });
    }
  });

  ipcMain.on('init-socket', (event, args) => {
    initSocket(win);
    event.sender.send('init-socket', { success: 1 });
  })
}
