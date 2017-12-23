import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable()
export class PlacesService {
    public places: PlaceModel[];
    public get placesAquired() {
        return this.places.filter(place => place.isAquired);
    };
    public placeMidway: Observable<{ latitude: number, longitude: number }>;
    public placesMidway: Observable<{ latitude: number, longitude: number }[]>;
    public placesChangedMidway: Subject<PlaceModel[]>;

    constructor() {
        this.placesChangedMidway = new Subject<PlaceModel[]>();
        this.placeMidway = this.placesChangedMidway
            .map(places => places && this.isAquired() ? getCentralGeoCoordinate(places) : null)
            .publishBehavior(null).refCount();
        this.placesMidway = this.placesChangedMidway
            .map(places => places ?
                places.filter(place => place.isAquired)
                    .map(place => { return { latitude: place.position.latitude, longitude: place.position.longitude } })
                : new Array<{ latitude: number, longitude: number }>())
            .publishBehavior(new Array<{ latitude: number, longitude: number }>()).refCount();
        this.clearPlaces();
        
        this.placesMidway.subscribe(value => console.log('placesMidway', value));
    }

    public addPlace() {
        this.places.push(new PlaceModel(this.places.length + 1));
    }
    public removeLastPlace() {
        if (this.places.length > 2) {
            this.places.pop();
        }
    }

    public clearPlaces() {
        this.places = new Array<PlaceModel>();
        this.places.push(new PlaceModel(1));
        this.places.push(new PlaceModel(2));
        this.placesChangedMidway.next(null);
    }

    public isAquired() {
        return this.places.length === this.places.filter(place => place.isAquired).length;
    }

    public runMidway() {
        this.placesChangedMidway.next(this.places);
    }
}

// https://stackoverflow.com/questions/28315027/calculation-of-center-point-from-list-of-latitude-and-longitude-are-slightly-dif
function getCentralGeoCoordinate(geoCoordinates: PlaceModel[]): { latitude: number, longitude: number } {
    if (geoCoordinates.length == 1) {
        return { latitude: geoCoordinates[0].position.latitude, longitude: geoCoordinates[0].position.longitude };
    }

    let x = 0;
    let y = 0
    let z = 0;
    geoCoordinates.forEach(geoCoordinate => {
        var latitude = geoCoordinate.position.latitude * Math.PI / 180;
        var longitude = geoCoordinate.position.longitude * Math.PI / 180;

        x += Math.cos(latitude) * Math.cos(longitude);
        y += Math.cos(latitude) * Math.sin(longitude);
        z += Math.sin(latitude);
    });

    var total = geoCoordinates.length;
    x = x / total;
    y = y / total;
    z = z / total;
    var centralLongitude = Math.atan2(y, x);
    var centralSquareRoot = Math.sqrt(x * x + y * y);
    var centralLatitude = Math.atan2(z, centralSquareRoot);
    return { latitude: centralLatitude * 180 / Math.PI, longitude: centralLongitude * 180 / Math.PI };
}

export class PlaceModel {
    public id: number;
    public position: { latitude: number, longitude: number };
    public isAquired: boolean;
    public adress: string;

    constructor(id: number) {
        this.id = id;
        this.isAquired = false;
        this.adress = '';
    }
}