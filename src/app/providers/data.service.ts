import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  tracks = new BehaviorSubject([]);
  races = new BehaviorSubject([]);
  models = new BehaviorSubject([]);
  records = new BehaviorSubject([]);

  constructor() { }

  setTracks(tracks) {
    this.tracks.next(tracks);
  }

  setRaces(races) {
    this.races.next(races);
  }

  setModels(models) {
    this.models.next(models);
  }

  setRecords(records) {
    this.records.next(records);
  }

}
