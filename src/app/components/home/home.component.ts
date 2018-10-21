import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Row } from '../../models/row';
import { DataService } from '../../providers/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['pgm', 'horse', 'odds', 'winPool', 'oddsDesc', 'oddsAdj', 'rating', 'rank', 'probability', 'ev', 'edge', 'betSize', 'bet'];
  dataSource: Row[] = [];

  subscriptions: Subscription[] = [];

  mtp = '';

  constructor(public data: DataService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.data.records.subscribe(records => {
        this.dataSource = records;
        this.calcBet(this.data.balance.value);
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
      if (row.bet < 0) {
        row.bet = 0;
      }
    });
  }

}
