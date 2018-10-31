import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { DataService } from '../../providers/data.service';
import { ElectronService } from '../../providers/electron.service';
import { UploadTypeComponent } from '../upload-type/upload-type.component';
import { dateStr } from '../../utils';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {
  @Output() onBet = new EventEmitter();
  @ViewChild('fileControl') fileControl:ElementRef;

  tracks = [];
  races = [];
  models = [];

  date = new Date();
  track = '';
  race = '';
  model = '';
  betType = '';

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
        this.tracks.sort();
      })
    );

    this.subscriptions.push(
      this.data.races.subscribe(races => {
        this.races = races;
        this.races.sort();
      })
    );

    this.subscriptions.push(
      this.data.models.subscribe(models => {
        this.models = models;
      })
    );

    this.subscriptions.push(
      this.data.onMTP.subscribe(() => {
        if (this.betType === 'mtp') {
          this.bet();
        }
      })
    );

    this.getTracks();
    this.electron.getModels();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getRaces() {
    this.race = '';
    const d = dateStr(this.date);
    this.electron.getRacesByDateAndTrack(d, this.track);
  }

  openTracks(opened) {
    if(opened) {
      this.getTracks();
    }
  }

  getTracks() {
    const d = dateStr(this.date);
    this.electron.getTracksByDate(d);
  }

  filter() {
    if (this.date && this.track && this.race && this.model) {
      const d = dateStr(this.date);
      this.data.setMTP(-1);
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

  bet() {
    this.onBet.emit({
      date: dateStr(this.date),
      track: this.track,
      race: this.race
    });
  }
}
