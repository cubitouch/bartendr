import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { LatLngBoundsLiteral, AgmMap } from '@agm/core';
import { Observable } from 'rxjs/Observable';
import { NavController } from 'ionic-angular';

import { PlacesService } from '../../app/services/places.service';
import { BarathonService } from '../../app/services/barathon.service';
import { BarModel } from '../../app/models/bar.model';
import { BarPage } from '../bar/bar';

@Component({
    selector: 'map-component',
    templateUrl: 'map.component.html',
})
export class MapComponent implements OnInit {
    @ViewChild(AgmMap) public map: AgmMap;

    @Input() public mapBounds: Observable<LatLngBoundsLiteral>;
    @Input() public position: Observable<{ latitude: number, longitude: number }>;
    @Input() public bars: Observable<BarModel[]>;
    @Input() public barsBarathon: Observable<BarModel[]>;
    @Input() public barathonItinerary: Observable<{ a: { latitude: number, longitude: number }, b: { latitude: number, longitude: number } }[]>;

    // https://snazzymaps.com/style/132/light-gray
    //   public mapStyles: any[] = [{ "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#d3d3d3" }] }, { "featureType": "transit", "stylers": [{ "color": "#808080" }, { "visibility": "off" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "visibility": "on" }, { "color": "#b3b3b3" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "weight": 1.8 }] }, { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{ "color": "#d7d7d7" }] }, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#ebebeb" }] }, { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#a7a7a7" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#efefef" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#696969" }] }, { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "visibility": "on" }, { "color": "#737373" }] }, { "featureType": "poi", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "color": "#d6d6d6" }] }, { "featureType": "road", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, {}, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "color": "#dadada" }] }];
    public mapStyles: any[] = [
        {
            "featureType": "administrative",
            "elementType": "labels",
            "stylers": [
                {
                    "color": "#ff0000"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "lightness": "-3"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "saturation": "43"
                },
                {
                    "lightness": "100"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#e0efef"
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "landscape.natural.landcover",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "saturation": "70"
                },
                {
                    "lightness": "100"
                },
                {
                    "gamma": "8.32"
                }
            ]
        },
        {
            "featureType": "landscape.natural.terrain",
            "stylers": [
                {
                    "gamma": "1.22"
                }
            ]
        },
        {
            "featureType": "landscape.natural.terrain",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "lightness": "47"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#e6f4d2"
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "stylers": [
                {
                    "color": "#e6f4d2"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#72a3ab"
                }
            ]
        },
        {
            "featureType": "road",
            "stylers": [
                {
                    "color": "#f4f4f4"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 100
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#f4f4f4"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "color": "#b5b5b5"
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 700
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "stylers": [
                {
                    "color": "#eaf6f8"
                }
            ]
        }
    ];

    constructor(
        public navCtrl: NavController,
        public placesService: PlacesService,
        public barathonService: BarathonService
    ) {
    }

    public ngOnInit() {

    }

    public centerChange(e) {
        this.barathonService.setMapCenter({ latitude: e.lat, longitude: e.lng });
    }
    public openBarPage(id: number) {
        this.navCtrl.push(BarPage, {
            id: id
        });
    }
}