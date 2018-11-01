import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { Row } from '../../models/row';
import { AppConfig } from '../../../environments/environment';
import { DataService } from '../../providers/data.service';
import { ElectronService } from '../../providers/electron.service';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(FilterComponent) filter: FilterComponent;

  displayedColumns: string[] = ['pgm', 'horse', 'odds', 'winPool', 'oddsDesc', 'oddsAdj', 'rating', 'rank', 'probability', 'ev', 'edge', 'betSize', 'bet'];
  dataSource: Row[] = [];

  subscriptions: Subscription[] = [];

  mtp = '';

  constructor(public data: DataService, private electron: ElectronService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.data.records.subscribe(records => {
        this.dataSource = records;
        this.calcBet(this.data.balance.value);
        this.dataSource.sort((a, b) => {
          if (a.odds === null && b.odds !== null) {
            return 1;
          } else if (b.odds === null && a.odds !== null) {
            return -1;
          }

          return Number(a.pgm) - Number(b.pgm);
        })
      })
    );

    this.subscriptions.push(
      this.data.balance.subscribe(balance => {
        this.calcBet(balance);
      })
    );
  }

  calcBet(balance) {
    this.dataSource.forEach(row => {
      row.bet = balance * row.betSize * row.kelly;
      if (row.bet < 0 || row.ev < 2) {
        row.bet = 0;
      }
    });
  }

  bet(ev) {
    const csv = this.dataSource.filter(row => row.bet >= 2)
      .map(row => [
          AppConfig.accountNumber,
          AppConfig.accountPin,
          ev.date,
          ev.track,
          ev.race,
          'WIN',
          row.pgm,
          row.bet.toFixed(2),
          'WHEEL'
        ].join(',')
      ).join('\n');

    console.log(csv);
    if (csv) {
      console.log('Upload');
    } else {
      console.log('There are no racers with minimum betting amount of $2.00');
    }

    // this.electron.uploadBets(csv);
  }
}
