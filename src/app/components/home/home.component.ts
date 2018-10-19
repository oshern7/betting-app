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

  displayedColumns: string[] = ['pgm', 'horse', 'odds', 'winPool', 'oddsDesc', 'oddsAdj', 'rating', 'rank', 'probability', 'ev', 'ep', 'edge', 'bet'];
  dataSource = [];

  subscription: Subscription;

  mtp = '';

  constructor(public data: DataService) { }

  ngOnInit() {
    this.subscription = this.data.records.subscribe(records => {
      this.dataSource = records;
    });
  }

}
