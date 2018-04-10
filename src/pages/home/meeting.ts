import { Component, OnInit } from '@angular/core';

import { ViewController } from 'ionic-angular';
import { PlacesService } from '../../app/services/places.service';
import { LocationService } from '../../app/services/location.service';

@Component({
  selector: 'page-meeting',
  templateUrl: 'meeting.html'
})
export class MeetingPage implements OnInit {
  public mode: string;
  public barathonCount: number;

  constructor(public viewCtrl: ViewController,
    public placesService: PlacesService,
    public locationService: LocationService) {
    this.mode = 'midway';
    this.barathonCount = 3;
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  run() {
    this.viewCtrl.dismiss();
    if (this.mode === 'midway') {
      if (this.placesService.isAquired()) {
        this.placesService.runMidway();
      }
    } else {
      this.placesService.runBarathon(this.barathonCount);
    }
  }
  public addMeeting() {
    this.placesService.addPlace();
  }
  public removeMeeting() {
    this.placesService.removeLastPlace();
  }
  public clearMeeting() {
    this.placesService.clearPlaces();
  }

  ngOnInit() {

  }
}
