export class Row {
  pgm: number;
  horse: string;
  odds: string;
  poolAmount: number;
  oddsDesc: number;
  oddsAdj: number;
  rating: number;
  rank: number;
  probability: number;
  ev: number;
  ep: number;
  edge: number;
  betSize: number;
  kelly: number;
  bet: number;
  event: string;

  constructor(data?) {
    if (data) {
      this.setNumber(data, 'pgm');
      this.setString(data, 'horse');
      this.setString(data, 'odds');
      this.setNumber(data, 'poolAmount');
      this.setNumber(data, 'oddsDesc');
      this.setNumber(data, 'oddsAdj');
      this.setNumber(data, 'rating');
      this.setNumber(data, 'rank');
      this.setNumber(data, 'probability');
      this.setNumber(data, 'ev');
      this.setNumber(data, 'ep');
      this.setNumber(data, 'edge');
      this.setNumber(data, 'betSize');
      this.setNumber(data, 'kelly');
      this.setString(data, 'event');
    }
  }

  setString(data, field) {
    if (data[field]) {
      this[field] = data[field] || '';
    }
  }

  setNumber(data, field) {
    if (data[field]) {
      this[field] = Number(data[field]);
    }
  }
}
