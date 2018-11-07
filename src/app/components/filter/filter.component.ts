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
  loadingTracks = true;
  races = [];
  loadingRaces = true;

  date = new Date();
  track = '';
  race = -1;
  betType = '';
  mtp = 0;
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
      this.data.onMTP.subscribe(() => {
        if (this.betType === 'mtp') {
          this.bet();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getRaces(opened) {
    if (opened) {
    this.race = -1;
    const d = dateStr(this.date);
    this.loadingRaces = true;
    this.electron.getRacesByDateAndTrack(d, this.track)
      .subscribe((res: any) => {
        if (res.success) {
          res.races.sort((r1, r2) => Number(r1.race) - Number(r2.race));
          this.races = res.races;
          this.loadingRaces = false;
        }
      })
    }
  }

  getTracks(opened) {
    if (opened) {
      const d = dateStr(this.date);
      this.loadingTracks = true;
      this.electron.getTracksByDate(d)
        .subscribe((res: any) => {
          if (res.success) {
            res.tracks.sort();
            this.tracks = res.tracks;
            this.loadingTracks = false;
          }
        });
    }
  }

  trackChanged(ev) {
    this.races = [];
    this.race = -1;
    this.loadingRaces = true;
    console.log('track changed')
  }

  raceChanged(ev) {
    this.raceObj = this.races.find(r => r.race === ev.value);
    this.mtp = 0;
    if (this.raceObj) {
      this.mtp = this.raceObj.mtp;
    }
  }

  filter() {
    if (this.date && this.track && this.race) {
      const d = dateStr(this.date);
      this.data.setMTP(-1);
      this.data.setMTP(this.raceObj.mtp);
      this.electron.setRoom(this.raceObj.RaceId);
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
