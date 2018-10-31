import { ipcMain } from 'electron';
import api from './api';
import initSocket from './socket';
import * as fs from 'fs';
import * as FormData from 'form-data';

export default (win, baseUrl) => {

  const {
    getTracksByDate,
    getRacesByDateAndTrack,
    getModels,
    uploadRatings,
    uploadRebates,
    uploadBettingModels,
    uploadBetting
  } = api(baseUrl);

  ipcMain.on('get-tracks', async (event, args) => {
    try {
      const { date } = args;
      const { tracks } = await getTracksByDate(date);
      event.sender.send('get-tracks', { success: 1, tracks });
    } catch (err) {
      console.log(err);
      event.sender.send('get-tracks', { success: 0, err: err.message });
    }
  });

  ipcMain.on('get-races', async (event, args) => {
    try {
      const { date, track } = args;
      const { races } = await getRacesByDateAndTrack(date, track);
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


  ipcMain.on('upload-ratings', async (event, args) => {
    try {
      const { models } = await uploadRatings(args.content);
      event.sender.send('upload-ratings', { success: 1 });
    } catch (err) {
      console.log(err);
      event.sender.send('upload-ratings', { success: 0, err: err.message });
    }
  });


  ipcMain.on('upload-betting-models', async (event, args) => {
    try {
      const { models } = await uploadBettingModels(args.content);
      event.sender.send('upload-betting-models', { success: 1 });
    } catch (err) {
      console.log(err);
      event.sender.send('upload-betting-models', { success: 0, err: err.message });
    }
  });


  ipcMain.on('upload-rebates', async (event, args) => {
    try {
      await uploadRebates(args.content);
      event.sender.send('upload-rebates', { success: 1 });
    } catch (err) {
      console.log(err);
      event.sender.send('upload-rebates', { success: 0, err: err.message });
    }
  });

  ipcMain.on('upload-betting', async (event, args) => {
    // Save bet.csv
    try {
      fs.writeFileSync('bet.csv', args);
    
      const formData = new FormData();
      formData.append('wagr', fs.createReadStream('bet.csv'));
      await uploadBetting(formData);

      // fs.unlinkSync('bet.csv');

      event.sender.send('upload-betting', { success: 1 });
    } catch(err) {
      console.log(err);
      event.sender.send('upload-betting', { success: 0, err: err.message });
    }
  });

  ipcMain.on('init-socket', (event, args) => {
    initSocket(win, baseUrl);
    event.sender.send('init-socket', { success: 1 });
  });
}
