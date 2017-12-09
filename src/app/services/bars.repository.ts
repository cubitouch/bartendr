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
        this.bars = this.http.get('./assets/bars.json')
            .map((data: any[]) => BarModel.fromList(data, this.locationService, this.timeService))
            .map(bars => {
                const result = bars
                    .map(bar =>
                        bar.distance.map((value, i) => Object.assign(bar, { unwrappedDistance: value }))
                    );
                return Observable.combineLatest(result);
            }
            )
            .flatMap(bars => bars.map(b => b.sort((a, b) => a.unwrappedDistance - b.unwrappedDistance)))
            .shareReplay();
    }

}
