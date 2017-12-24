import { Component, OnInit } from '@angular/core';

import { ViewController } from 'ionic-angular';
import { PlacesService } from '../../app/services/places.service';

@Component({
  selector: 'page-meeting',
  templateUrl: 'meeting.html'
})
export class MeetingPage implements OnInit {
  constructor(public viewCtrl: ViewController,
    public placesService: PlacesService) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
    if (this.placesService.isAquired()){
      this.placesService.runMidway();
    }
  }
  public addMeeting() {
    this.placesService.addPlace();
  }
  public removeMeeting() {
    this.placesService.removeLastPlace();
  }
  public clearMeeting(){
    this.placesService.clearPlaces();
  }

  ngOnInit() {

  }
}
