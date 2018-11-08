export class Race {
  id: string;
  date: string;
  track: string;
  event: string;
  race: string;
  mtp: number;

  constructor(data?) {
    if (data) {
      this.setString(data, 'id');
      this.setString(data, 'date');
      this.setString(data, 'track');
      this.setString(data, 'event');
      this.setString(data, 'race');
      this.setNumber(data, 'mtp');
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
