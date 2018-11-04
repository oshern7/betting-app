import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { DataService } from '../../providers/data.service';
import { ElectronService } from '../../providers/electron.service';
import { UploadTypeComponent } from '../upload-type/upload-type.component';
import { dateStr } from '../../utils';
import { Race } from '../../models/race';

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
  race = -1;
  model = '';
  betType = '';
  timer: any;
  mtp = '';
  raceObj: Race;
  visible = false;

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
        this.races.sort((r1, r2) => Number(r1.race) - Number(r2.race));
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

    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  getRaces() {
    this.race = null;
    const d = dateStr(this.date);
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.electron.getRacesByDateAndTrack(d, this.track);
    this.timer = setInterval(() => {
      this.electron.getRacesByDateAndTrack(d, this.track);
    }, 60000);
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

  raceChanged(ev) {
    const raceObj = this.races.find(r => r.race === ev.value);
    this.mtp = raceObj.mtp;
  }

  filter() {
    if (this.date && this.track && this.race && this.model) {
      const d = dateStr(this.date);
      this.data.setMTP(-1);
      this.data.setMTP(this.race);
      this.raceObj = this.races.find(r => r.race === this.race);
      this.electron.setRoom(d, this.track, this.race, this.model);
      this.visible = false;
    }
  }

  toggleFilter() {
    this.visible = !this.visible;
  }

  change(ev) {
    const balance = ev.target.value.replace(/[\s\$,]/g, '');
    this.data.setBalance(+balance);
  }

  openUploadTypeSheet() {
    this.dialog.open(UploadTypeComponent);
  }

  bet() {
    if (this.raceObj) {
      this.onBet.emit({
        date: dateStr(this.date),
        track: this.raceObj.event,
        race: this.race
      });
    }
  }
}
