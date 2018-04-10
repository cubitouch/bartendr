import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/filter';
import { DayOfWeek } from "../models/bar.model";

@Injectable()
export class TimeService {
    public time: Observable<Date>;
    public day: Observable<DayOfWeek>;

    constructor() {
        this.time = Observable.interval(5000)
            .filter(value => document.visibilityState === 'visible')
            .map(i => new Date())
            .publishBehavior(new Date()).refCount();
        this.day = this.time.map(t => t.getDay() as DayOfWeek);
    }
}