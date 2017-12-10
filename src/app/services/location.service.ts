import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/publishBehavior';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromPromise';
import { Storage } from '@ionic/storage';
import { BarModel } from "../models/bar.model";

@Injectable()
export class LocationService {
    public positionUpdater: Subject<{ latitude: number, longitude: number }>;
    public position: Observable<{ latitude: number, longitude: number }>;

    public lastPosition: Observable<{ latitude: number, longitude: number }>;

    constructor(private storage: Storage) {
        this.lastPosition = this.getLastPosition();

        this.positionUpdater = new Subject<{ latitude: number, longitude: number }>();
        this.position = this.lastPosition.flatMap(lastPosition => {
            return this.positionUpdater
                .publishBehavior({
                    latitude: lastPosition.latitude,
                    longitude: lastPosition.longitude
                }).refCount();
        });
        this.positionUpdater.subscribe(value => {
            this.saveLastPosition(value);
        });

        this.getPosition();
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
                    if (this.lastGetPositionCallback) {
                        this.lastGetPositionCallback();
                    }
                }, this.error);
            } else {
                this.error();
            }
        }, 1000);
    }
    public error(err?) {
        if (this.lastGetPositionCallback) {
            this.lastGetPositionCallback();
        }
        alert('Désolé, nous ne pouvons pas récupérer votre position: ' + err);
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

    public getDistance(bar: BarModel): Observable<number> {
        return this.position.map(position => distanceInKmBetweenEarthCoordinates(
            bar.latitude,
            bar.longitude,
            position.latitude,
            position.longitude
        ));
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
