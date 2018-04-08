import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/publishBehavior';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromPromise';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BarModel } from "../models/bar.model";
import { PlacesService } from "./places.service";

@Injectable()
export class LocationService {
    public positionUpdater: Subject<{ latitude: number, longitude: number }>;
    public position: Observable<{ latitude: number, longitude: number }>;

    public lastPosition: Observable<{ latitude: number, longitude: number }>;

    constructor(private storage: Storage, private alertCtrl: AlertController,
        private placesService: PlacesService) {
        this.lastPosition = this.getLastPosition();

        this.positionUpdater = new Subject<{ latitude: number, longitude: number }>();
        this.position = this.lastPosition.flatMap(lastPosition => {
            return this.positionUpdater
                .publishBehavior({
                    latitude: lastPosition.latitude,
                    longitude: lastPosition.longitude
                }).refCount();
        })
            .combineLatest(this.placesService.placeMidway)
            .map(([position, positionMidway]) => positionMidway || position);
        this.positionUpdater.subscribe(value => {
            this.saveLastPosition(value);
        });

        setTimeout(() => { this.getPosition(); }, 2000);
    }

    private lastGetPositionCallback: () => void;
    public getPosition(callback?: () => void) {
        this.lastGetPositionCallback = callback;

        setTimeout(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.positionUpdater.next({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    this.placesService.clearPlaces();
                    if (this.lastGetPositionCallback) {
                        this.lastGetPositionCallback();
                    }
                }, () => { this.error(); });
            } else {
                this.error();
            }
        }, 500);
    }
    public error(err?) {
        if (this.lastGetPositionCallback) {
            this.lastGetPositionCallback();
        }
        let alert = this.alertCtrl.create({
            title: 'Désolé',
            subTitle: 'Nous ne pouvons pas récupérer votre position pour le moment',
            buttons: ['Ok']
        });
        alert.present();
    }

    public getLastPosition(): Observable<{ latitude: number, longitude: number }> {
        return Observable.fromPromise(this.storage.get('lastLocation').then((result: { latitude: number, longitude: number }) => {
            if (result) {
                return result;
            }
            return {
                latitude: 48.866667,
                longitude: 2.333333
            };
        }));
    }
    public saveLastPosition(value: { latitude: number, longitude: number }) {
        this.storage.set('lastLocation', value);
    }

    public getDistanceBetween(barA: BarModel, barB: BarModel): number {
        return this.getDistance(barA, { latitude: barB.latitude, longitude: barB.longitude });
    }
    public getDistance(bar: BarModel, position: { latitude: number, longitude: number }): number {
        return distanceInKmBetweenEarthCoordinates(
            bar.latitude,
            bar.longitude,
            position.latitude,
            position.longitude
        );
    }

    public getItinerary(bars: BarModel[]): { a: { latitude: number, longitude: number }, b: { latitude: number, longitude: number } }[] {
        const itinerary = new Array<{ a: { latitude: number, longitude: number }, b: { latitude: number, longitude: number } }>();

        // TODO : Fix itinerary algorithm :)
        // console.log('barsathon', bars);

        var positions = bars.map(function (bar) { return { lat: bar.latitude, lng: bar.longitude }; });
        console.log(positions);

        var travels = [];

        var distances = [];
        for (var i = 0; i < positions.length - 1; i++) {
            for (var j = i + 1; j < positions.length; j++) {
                distances.push({
                    a: positions[i],
                    b: positions[j],
                    distance: distanceInKmBetweenEarthCoordinates(positions[i].lat, positions[i].lng, positions[j].lat, positions[j].lng)
                });
            }
        }
        distances = distances.sort(function (a, b) { return a.distance - b.distance });
        // console.log('distance', distances);
        this.chooseTravel(distances, travels, distances[0], true);

        var maxLoop = 500;
        var iLoop = 0;
        do {
            // take a coordinates
            var coord = travels[travels.length - 1];
            // console.log('coord', coord);
            var results = this.getDistancesFromPoint(distances, travels, coord);

            var isBpoint = false;
            if (results.length == 0) {
                isBpoint = true;
                results = this.getDistancesFromPoint(distances, travels, coord, true);
            }

            if (results.length > 0) {
                this.chooseTravel(distances, travels, results[0], isBpoint);
            } else {
                // end of path to be sure
                // console.log('break');
                break;
            }
            // choose path
            iLoop++;
            // console.log('travels.length < positions.length-1 && iLoop < maxLoop', distances, travels, iLoop, travels.length < positions.length - 1 && iLoop < maxLoop);
        } while (travels.length - 1 < positions.length && iLoop < maxLoop);

        // console.log('travels', travels);
        // console.log('distance', distances);

        for (var k = 1; k < travels.length; k++) {
            itinerary.push({
                a: { latitude: travels[k - 1].lat, longitude: travels[k - 1].lng },
                b: { latitude: travels[k].lat, longitude: travels[k].lng }
            });
        }

        return itinerary;
    }
    private getDistancesFromPoint(distances, travels, coord, isB?) {
        return distances
            // find all distances that link a to distance.a or distance.b
            .filter(function (distance) { return distance.a.lat == coord.lat && distance.a.lng == coord.lng || distance.b.lat == coord.lat && distance.b.lng == coord.lng; })
            // filter distance with end of path already on the current travel
            .filter(function (distance) {
                return travels.filter(function (travel) {
                    if (isB) {
                        return distance.a.lat == travel.lat && distance.a.lng == travel.lng;
                    }
                    return distance.b.lat == travel.lat && distance.b.lng == travel.lng;
                }).length == 0;
            })
            // order results by distance
            .sort(function (a, b) { return a.distance - b.distance });
    }

    private chooseTravel(distances, travels, distance, isFirst) {
        // console.log('choose', distance);
        var i = distances.indexOf(distance);
        if (isFirst) {
            travels.push(distance.a);
        }
        travels.push(distance.b);
        distances.splice(i, 1);
    }


}

function degreesToRadians(degrees): number {
    return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2): number {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}
