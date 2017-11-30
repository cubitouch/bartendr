import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { NavController } from 'ionic-angular';
import { LatLngBoundsLiteral } from '@agm/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import { BarModel } from '../../app/models/bar.model';
import { BarPage } from '../bar/bar';
import { TemplateBindingParseResult } from '@angular/compiler';
import { BarRepository } from '../../app/services/bars.repository';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  public isModeMap: boolean;
  public bars: Observable<BarModel[]>;

  // https://snazzymaps.com/style/132/light-gray
  public mapStyles: any[] = [{ "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#d3d3d3" }] }, { "featureType": "transit", "stylers": [{ "color": "#808080" }, { "visibility": "off" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "color": "#b3b3b3" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "weight": 1.8 }] }, { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{ "color": "#d7d7d7" }] }, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#ebebeb" }] }, { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#a7a7a7" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#efefef" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#696969" }] }, { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "visibility": "on" }, { "color": "#737373" }] }, { "featureType": "poi", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "color": "#d6d6d6" }] }, { "featureType": "road", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, {}, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "color": "#dadada" }] }];
  public mapZoom: number = 11;
  public mapBounds: Observable<LatLngBoundsLiteral>;

  constructor(public navCtrl: NavController,
    private barsRepository: BarRepository,
    private sanitization: DomSanitizer) {
    this.isModeMap = false;
  }

  public safeUrl(value: string): SafeStyle {
    return this.sanitization.bypassSecurityTrustStyle('linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(' + value + ')');
  }
  public toggleMapDisplay() {
    this.isModeMap = !this.isModeMap;
  }
  public openBarPage(id: number) {
    this.navCtrl.push(BarPage, {
      id: id
    });
  }

  ngOnInit() {
    this.bars = this.barsRepository.bars;

    this.mapBounds = this.bars.map(bars => {
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
    });
  }

}
