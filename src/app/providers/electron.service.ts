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
    this.send('get-tracks', { date })
      .subscribe((res: any) => {
        if (res.success) {
          this.data.setTracks(res.tracks);
        }
      });
  }

  getRacesByDateAndTrack(date, track) {
    this.send('get-races', { track, date })
      .subscribe((res: any) => {
        if (res.success) {
          this.data.setRaces(res.races);
        }
      });
  }

  getModels() {
    this.send('get-models')
      .subscribe((res: any) => {
        if (res.success) {
          this.data.setModels(res.models);
        }
      });
  }

  initSocket() {
    this.send('init-socket').subscribe(() => {});
  }

  listenToFeeds() {
    this.listen('feed').subscribe((data: any) => {
      this.data.setRecords(data && data.data);
      if (data && data.race) {
        this.data.setMTP(data.race.mtp);
      } else {
        this.data.setMTP(-1);
      }
    });
  }

  setRoom(date, track, race, model) {
    this.send('set-room', {date, track, race, model})
      .subscribe(() => {});
  }

  uploadRatings(content) {
    this.send('upload-ratings', { content })
      .subscribe(() => {});
  }

  uploadBettingModels(content) {
    this.send('upload-betting-models', { content })
      .subscribe(() => {
        this.getModels();
      });
  }

  uploadRebates(content) {
    this.send('upload-rebates', { content })
      .subscribe(() => {});
  }

  uploadBets(data) {
    this.send('upload-betting', data)
      .subscribe(() => {})
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
