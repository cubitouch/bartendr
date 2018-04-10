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


    public getItinerary(position: { latitude: number, longitude: number }, bars: BarModel[]): { a: { latitude: number, longitude: number }, b: { latitude: number, longitude: number } }[] {
        const itinerary = new Array<{ a: { latitude: number, longitude: number }, b: { latitude: number, longitude: number } }>();

        if (bars) {
            var positions = bars.map(function (bar) { return { lat: bar.latitude, lng: bar.longitude }; });
            // get the farest point from the position
            var origin = positions
                .map(barPosition => { return { position: barPosition, distance: distanceInKmBetweenEarthCoordinates(position.latitude, position.longitude, barPosition.lat, barPosition.lng) } })
                .sort(function (a, b) { return a.distance - b.distance })[0];
            // get a list of all other points
            positions.splice(positions.indexOf(origin.position), 1);
            // LOOP while list is not empty
            var i = 0;
            while (positions.length > 0 && i < 500) {
                // -- get the next closest point
                var next = positions
                    .map(barPosition => { return { position: barPosition, distance: distanceInKmBetweenEarthCoordinates(origin.position.lat, origin.position.lng, barPosition.lat, barPosition.lng) } })
                    .sort(function (a, b) { return a.distance - b.distance })[0];
                // add path item
                itinerary.push({ a: { latitude: origin.position.lat, longitude: origin.position.lng }, b: { latitude: next.position.lat, longitude: next.position.lng } })

                // -- remove this last one
                origin = next;
                positions.splice(positions.indexOf(origin.position), 1);
                i++;
            }
        }

        return itinerary;
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
