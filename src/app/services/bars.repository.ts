import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { BarModel } from "../models/bar.model";
import { LocationService } from "./location.service";
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';
import { TimeService } from "./time.service";

@Injectable()
export class BarRepository {
    public bars: Observable<BarModel[]>;

    constructor(
        private http: HttpClient,
        private locationService: LocationService,
        private timeService: TimeService,
    ) {
        this.bars = Observable.combineLatest(
            this.http.get('./assets/bars.json'),
            this.locationService.position)
            .map(([data, position]) => BarModel.fromList(data as any[], this.locationService, position, this.timeService))
            .map(bars => bars.sort((a, b) => a.distance - b.distance))
            .shareReplay();
    }

}
