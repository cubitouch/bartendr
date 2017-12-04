import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/publishBehavior';
import 'rxjs/add/operator/debounceTime';
import { BarModel } from "../models/bar.model";

@Injectable()
export class LocationService {
    public positionUpdater: Subject<{ latitude: number, longitude: number }>;
    public position: Observable<{ latitude: number, longitude: number }>;

    constructor() {
        this.positionUpdater = new Subject<{ latitude: number, longitude: number }>();
        this.position = this.positionUpdater
            .publishBehavior({
                latitude: 48.866667,
                longitude: 2.333333
            }).refCount();

        setTimeout(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    // alert(position.coords.latitude + '|' + position.coords.longitude);
                    this.positionUpdater.next({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                }, this.error);
            } else {
                this.error();
            }
        }, 1000);
    }

    public error(err?) {
        alert('Désolé, nous ne pouvons pas récupérer votre position: ' + err);
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
