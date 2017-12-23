import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { BarModel } from '../../app/models/bar.model';
import { BarRepository } from '../../app/services/bars.repository';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { TimeService } from '../../app/services/time.service';

@Component({
  selector: 'page-bar',
  templateUrl: 'bar.html'
})
export class BarPage implements OnInit {
  selectedItem: any;
  private id: number;
  public bar: Observable<BarModel>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private barsRepository: BarRepository,
    public timeService: TimeService,
    private sanitization: DomSanitizer) {
    // this.bar = Observable.of(new BarModel());
  }

  public safeUrl(value: string): SafeStyle {
    return this.sanitization.bypassSecurityTrustStyle('linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(' + value + ')');
  }
  ngOnInit() {
    this.id = parseFloat(this.navParams.data['id']);

    this.bar = this.barsRepository.bars
      .map(bars => bars.filter(bar => bar.id === this.id)[0])
      .shareReplay();
  }
}
