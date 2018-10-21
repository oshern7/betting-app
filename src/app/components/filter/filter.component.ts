import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

import { DataService } from '../../providers/data.service';
import { ElectronService } from '../../providers/electron.service';
import { fx2 } from '../../utils';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  tracks = [];
  races = [];
  models = [];

  date = new Date();
  track = '';
  race = '';
  model = '';

  subscriptions: Subscription[] = [];

  constructor(
    public data: DataService,
    private electron: ElectronService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.data.tracks.subscribe(tracks => {
        this.tracks = tracks;
      })
    );

    this.subscriptions.push(
      this.data.races.subscribe(races => {
        this.races = races;
      })
    );

    this.subscriptions.push(
      this.data.models.subscribe(models => {
        this.models = models;
      })
    );

    this.electron.getTracks();
    this.electron.getModels();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getRaces() {
    this.race = '';
    this.electron.getRaces(this.track);
  }

  openTracks(opened) {
    if(opened) {
      this.electron.getTracks();
    }
  }

  filter() {
    if (this.date && this.track && this.race && this.model) {
      const d = `${this.date.getFullYear()}-${fx2(this.date.getMonth()+1)}-${fx2(this.date.getDate())}`;
      this.electron.setRoom(d, this.track, this.race, this.model);
    }
  }

  change(ev) {
    const balance = ev.target.value.replace(/[\s\$,]/g, '');
    this.data.setBalance(+balance);
  }
}
