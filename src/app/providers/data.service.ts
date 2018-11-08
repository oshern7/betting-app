import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  tracks = new BehaviorSubject([]);
  races = new BehaviorSubject([]);
  currentRace = new BehaviorSubject(null);
  records = new BehaviorSubject([]);
  balance = new BehaviorSubject(0);
  model = new BehaviorSubject('None');
  onMTP = new Subject();
  mtp = -1;

  constructor() { }

  setTracks(tracks) {
    this.tracks.next(tracks || []);
  }

  setRaces(races) {
    this.races.next(races || []);
  }

  setRecords(records) {
    this.records.next(records);
    if (records.length > 0) {
      this.setModel(records[0].model)
    }
  }

  setBalance(balance) {
    this.balance.next(balance);
  }

  setModel(model) {
    if (model === 0) {
      this.model.next('None');
    } else {
      this.model.next(model);
    }
  }

  setMTP(mtp: number) {
    console.log('MTP updated: ', mtp)
    if (mtp === 0 && this.mtp > 0) {
      this.onMTP.next();
    }

    this.mtp = mtp;
  }

  setRace(race) {
    const crace = this.currentRace.value;
    if (crace && crace.id === race.id && crace.mtp > 0 && race.mtp === "0") {
      this.onMTP.next();
    }
    this.currentRace.next(race);
  }
}
