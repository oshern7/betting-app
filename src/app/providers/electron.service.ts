import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { Observable } from 'rxjs';

import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;

  constructor(private data: DataService) {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  getTracksByDate(date) {
    return this.send('get-tracks', { date });
  }

  getRacesByDateAndTrack(date, track) {
    return this.send('get-races', { track, date });
  }

  initSocket() {
    this.send('init-socket').subscribe(() => {});
  }

  listenToFeeds() {
    this.listen('feed').subscribe((data: any) => {
      if (data) {
        this.data.setRecords(data.data);
        this.data.setRace(data.race)
      }
    });
  }

  setRoom(RaceId) {
    this.send('set-room', { RaceId })
      .subscribe(() => {});
  }

  uploadRatings(content) {
    this.send('upload-ratings', { content })
      .subscribe(() => {
        console.log('Ratings uploaded successfully')
      });
  }

  uploadBettingModels(content) {
    this.send('upload-betting-models', { content })
      .subscribe(() => {
        console.log('Models uploaded successfully')
      });
  }

  uploadRebates(content) {
    this.send('upload-rebates', { content })
      .subscribe(() => {
        console.log('Rebates uploaded successfully')
      });
  }

  uploadBets(data) {
    this.send('upload-betting', data)
      .subscribe(() => {
        console.log('Betting was done successfully')
      })
  }

  private listen(ch) {
    return new Observable(observer => {
      this.ipcRenderer.on(ch, (event, args) => {
        console.log('Listen to ', ch, args)
        observer.next(args);
      });
    });
  }

  private send(ch, args?) {
    this.ipcRenderer.send(ch, args);

    console.log('Call', ch);
    console.log(args);

    return new Observable(observer => {
      this.ipcRenderer.once(ch, (event, args1) => {
        console.log('Received', ch);
        console.log(args1)
        observer.next(args1);
        observer.complete();
      });
    });
  }

}
