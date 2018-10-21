import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { map, switchMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

import { DataService } from '../../providers/data.service';
import { ElectronService } from '../../providers/electron.service';
import { UploadTypeComponent } from '../upload-type/upload-type.component';
import { fx2 } from '../../utils';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {
  @ViewChild('fileControl') fileControl:ElementRef;

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
    private electron: ElectronService,
    private dialog: MatDialog,
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

    const d = `${this.date.getFullYear()}-${fx2(this.date.getMonth()+1)}-${fx2(this.date.getDate())}`;
    this.electron.getTracksByDate(d);
    this.electron.getModels();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getRaces() {
    this.race = '';
    const d = `${this.date.getFullYear()}-${fx2(this.date.getMonth()+1)}-${fx2(this.date.getDate())}`;
    this.electron.getRacesByDateAndTrack(d, this.track);
  }

  openTracks(opened) {
    if(opened) {
      const d = `${this.date.getFullYear()}-${fx2(this.date.getMonth()+1)}-${fx2(this.date.getDate())}`;
      this.electron.getTracksByDate(d);
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

  openUploadTypeSheet() {
    this.dialog.open(UploadTypeComponent);
  }
}
