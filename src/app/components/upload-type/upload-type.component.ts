import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-upload-type',
  templateUrl: './upload-type.component.html',
  styleUrls: ['./upload-type.component.scss']
})
export class UploadTypeComponent implements OnInit {
  content = '';
  type = '';

  constructor(
    private dialog: MatDialogRef<UploadTypeComponent>,
    private electron: ElectronService
  ) { }

  ngOnInit() {
  }

  upload(type) {
    if (this.content && this.type) {
      switch (this.type) {
        case "ratings":
          this.electron.uploadRatings(this.content);
          break;

        case "rebates":
          this.electron.uploadRebates(this.content);
          break;

        case "betting-models":
          this.electron.uploadBettingModels(this.content);
          break;
      }
      this.dialog.close();
    }
  }

  fileSelected(ev) {
    if (ev.target.files.length > 0) {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.content = event.target.result;
      }
      reader.readAsText(file);
    }
  }
}
