import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { BarModel } from "../models/bar.model";
import { LocationService } from "./location.service";
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/zip';

import { TimeService } from "./time.service";

@Injectable()
export class BarRepository {
    public bars: Observable<BarModel[]>;

    constructor(
        private http: HttpClient,
        private locationService: LocationService,
        private timeService: TimeService,
    ) {
        this.bars = this.http.get('./assets/bars.json')
            .map((data: any[]) => BarModel.fromList(data))
            .shareReplay()
            .combineLatest(this.locationService.position)
            .map(([list, position]) => {
                list.forEach(bar => bar.initPosition(this.locationService, position));
                return list;
            })
            .map(bars => bars.sort((a, b) => a.distance - b.distance))
            .shareReplay()
            .zip(this.timeService.time)
            .map(([list, time]) => {
                list.forEach(bar => bar.initTime(time));
                return list;
            })
            .shareReplay();
    }
}
