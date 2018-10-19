import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Row } from '../../models/row';
import { tableData } from '../../constants/sample-data';
import { DataService } from '../../providers/data.service';

const ELEMENT_DATA: Row[] = tableData;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['pgm', 'horse', 'odds', 'winPool', 'oddsDesc', 'oddsAdj', 'rating', 'rank', 'probability', 'ev', 'ep', 'edge', 'bet'];
  dataSource = ELEMENT_DATA;

  subscription: Subscription;

  constructor(public data: DataService) { }

  ngOnInit() {
    this.subscription = this.data.records.subscribe(records => {
      this.dataSource = records;
    });
  }

}
