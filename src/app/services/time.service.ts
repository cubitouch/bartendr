import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import { DayOfWeek } from "../models/bar.model";
import moment from 'moment';

@Injectable()
export class TimeService {
    public time: Observable<Date>;
    public day: Observable<DayOfWeek>;

    constructor() {
        this.time = Observable.interval(5000)
            .map(i => new Date())
            .share()
            .publishBehavior(new Date()).refCount();
        this.day = this.time.map(t => t.getDay() as DayOfWeek);
    }
}