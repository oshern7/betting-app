import { Component, OnInit } from '@angular/core';
import { Row } from '../../models/row';
import { tableData } from '../../constants/sample-data';

const ELEMENT_DATA: Row[] = tableData;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['pgm', 'horse', 'odds', 'winPool', 'oddsDesc', 'oddsAdj', 'rating', 'rank', 'probability', 'ev', 'ep', 'edge', 'bet'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {
  }

}
