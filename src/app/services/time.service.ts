import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import { DayOfWeek } from "../models/bar.model";

@Injectable()
export class TimeService {
    public time: Observable<Date>;
    public day: Observable<DayOfWeek>;

    constructor() {
        this.time = Observable.interval(5000).map(i => new Date()).startWith(new Date());
        this.day = this.time.map(t => t.getDay() as DayOfWeek);
    }
}