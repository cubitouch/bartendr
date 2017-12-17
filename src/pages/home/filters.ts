import { Component, OnInit } from '@angular/core';

import { ViewController } from 'ionic-angular';
import { FiltersService } from '../../app/services/filters.service';

@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html'
})
export class FiltersPage implements OnInit {

  public openOnly: boolean;

  constructor(public viewCtrl: ViewController,
    public filtersService: FiltersService) {
    this.openOnly = false;
  }

  public toggleOpenOnly() {
    this.filtersService.openOnly = !this.filtersService.openOnly;
    this.filtersService.filtersChanged();
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  ngOnInit() {

  }
}
