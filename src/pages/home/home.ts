import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { NavController, LoadingController, ModalController } from 'ionic-angular';
import { LatLngBoundsLiteral } from '@agm/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/observable/combineLatest';
import { BarModel } from '../../app/models/bar.model';
import { BarPage } from '../bar/bar';
import { BarRepository } from '../../app/services/bars.repository';
import { LocationService } from '../../app/services/location.service';
import { FiltersService } from '../../app/services/filters.service';
import { FiltersPage } from './filters';
import { MeetingPage } from './meeting';
import { PlacesService } from '../../app/services/places.service';
import { TimeService } from '../../app/services/time.service';
import { BarathonService } from '../../app/services/barathon.service';
import { MapComponent } from './map.component';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  @ViewChild(MapComponent) public map: MapComponent;

  public pageSizeDefault: number = 5;
  public isModeMap: boolean;
  public bars: Observable<BarModel[]>;
  public barsDisplayed: Observable<BarModel[]>;
  public pageSizeIncrease: Subject<any>;
  public pageSize: Observable<number>;
  public isLazyLoadingAvailable: Observable<boolean>;
  public position: Observable<{ latitude: number, longitude: number }>;

  public barsBarathon: Observable<BarModel[]>;
  public barathonItinerary: Observable<{ a: { latitude: number, longitude: number }, b: { latitude: number, longitude: number } }[]>;

  public mapBounds: Observable<LatLngBoundsLiteral>;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private barsRepository: BarRepository,
    private locationService: LocationService,
    private filtersService: FiltersService,
    public placesService: PlacesService,
    public timeService: TimeService,
    private sanitization: DomSanitizer,
    private barathonService: BarathonService) {
    this.isModeMap = false;
  }

  public refreshPosition(refresher) {
    if (refresher) {
      this.locationService.getPosition(() => {
        refresher.complete();
      });
    } else {
      let loader = this.loadingCtrl.create({
        content: "Localisation en cours..."
      });
      loader.present();
      this.locationService.getPosition(() => {
        loader.dismiss();
      });
    }
  }
  public openFilters() {
    const filters = this.modalCtrl.create(FiltersPage);
    filters.present();
  }

  public openMeeting() {
    const meeting = this.modalCtrl.create(MeetingPage);
    meeting.present();
  }

  public safeUrl(value: string): SafeStyle {
    return this.sanitization.bypassSecurityTrustStyle('linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(' + value + ')');
  }

  private mapWasResized: boolean = false;
  public toggleMapDisplay() {
    this.isModeMap = !this.isModeMap;
    if (!this.mapWasResized) {
      this.map.map.triggerResize(true);
      this.mapWasResized = true;
    }
  }
  public openBarPage(id: number) {
    this.navCtrl.push(BarPage, {
      id: id
    });
  }

  public doInfinite(infiniteScroll) {
    this.pageSizeIncrease.next();
    infiniteScroll.complete();
  }
  ngOnInit() {
    this.position = this.locationService.position
      .combineLatest(this.placesService.placeMidway)
      .map(([position, midway]) => midway || position);
    this.position.subscribe(position => {
      this.mapWasResized = false;
    });
    this.placesService.placeMidway.subscribe(position => {
      if (position) {
        this.isModeMap = false;
        this.toggleMapDisplay();
      }
    });
    this.placesService.barathonCount.subscribe(count => {
      if (count > 0) {
        this.isModeMap = false;
        this.toggleMapDisplay();
      }
    });
    this.bars = this.barsRepository.bars
      .combineLatest(this.filtersService.filters, this.timeService.time)
      .map(([bars, filters, time]) => bars.filter(bar => {
        if (filters.openOnly) {
          return bar.schedule.getIsOpenNow(time);
        }
        return true;
      }))
      .shareReplay();

    this.barsBarathon = Observable.combineLatest(
      this.bars,
      this.placesService.barathonCount,
      this.barathonService.barathonPosition
    ).map(([bars, count, position]) => {
      if (position) {
        // filter bar list
        return bars.sort((barA, barB) => this.locationService.getDistance(barA, position) - this.locationService.getDistance(barB, position))
          .slice(0, count);
      } else {
        return null;
      }
    })
      .shareReplay();
    this.barathonItinerary = Observable.combineLatest(
      this.barsBarathon,
      this.barathonService.barathonPosition).map(([bars, position]) => {
        if (position) {
          return this.locationService.getItinerary(position, bars);
        } else {
          return [];
        }
      });

    this.mapBounds = Observable.combineLatest(this.bars, this.barsBarathon).map(([barsBase, barsBarathon]) => {
      const bars = barsBarathon || barsBase;
      const bounds = <LatLngBoundsLiteral>{
        north: bars[0].latitude,
        south: bars[0].latitude,
        east: bars[0].longitude,
        west: bars[0].longitude,
      };

      bars.forEach(bar => {
        if (bar.latitude < bounds.south) {
          bounds.south = bar.latitude;
        }
        if (bar.latitude > bounds.north) {
          bounds.north = bar.latitude;
        }

        if (bar.longitude < bounds.west) {
          bounds.west = bar.longitude;
        }
        if (bar.longitude > bounds.east) {
          bounds.east = bar.longitude;
        }
      });

      return bounds;
    }).withLatestFrom(this.position)
      .map(([bounds, position]) => { return (position ? null : bounds); });

    this.pageSizeIncrease = new Subject<any>();
    this.pageSize = this.pageSizeIncrease.scan((acc, x) => acc + this.pageSizeDefault, this.pageSizeDefault).startWith(this.pageSizeDefault);
    this.barsDisplayed = Observable.combineLatest(this.bars, this.pageSize)
      .map(([bars, size]) => bars.slice(0, size));
    this.isLazyLoadingAvailable = Observable.combineLatest(this.bars, this.pageSize)
      .map(([bars, size]) => bars.length >= size);
  }

  public trackById(index, item) {
    return item.id;
  }

  public computeBarathon() {
    this.barathonService.setActive(true);
  }
  public clearBarathon() {
    this.barathonService.setActive(false);
    this.placesService.clearBarathon();
  }

}
