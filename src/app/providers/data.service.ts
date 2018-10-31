import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  tracks = new BehaviorSubject([]);
  races = new BehaviorSubject([]);
  models = new BehaviorSubject([]);
  records = new BehaviorSubject([]);
  balance = new BehaviorSubject(0);
  onMTP = new Subject();
  mtp = -1;

  constructor() { }

  setTracks(tracks) {
    this.tracks.next(tracks || []);
  }

  setRaces(races) {
    this.races.next(races || []);
  }

  setModels(models) {
    this.models.next(models || []);
  }

  setRecords(records) {
    if (records.length > 0) {
      this.setMTP( +(records[0].mtp) );
    }
    this.records.next(records);
  }

  setBalance(balance) {
    this.balance.next(balance);
  }

  setMTP(mtp: number) {
    if (mtp === 0 && this.mtp === 1) {
      this.onMTP.next();
    }

    this.mtp = mtp;
  }
}
