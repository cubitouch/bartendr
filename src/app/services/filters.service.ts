import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/publishBehavior';
import { DayOfWeek } from "../models/bar.model";
import moment from 'moment';

@Injectable()
export class FiltersService {
    public model: FiltersModel;
    public get openOnly(): boolean {
        return this.model.openOnly;
    };
    public set openOnly(value: boolean) {
        this.model.openOnly = value;
        this.filtersChanged();
    };

    private filtersUpdater: Subject<FiltersModel>;
    public filters: Observable<FiltersModel>;

    constructor() {
        this.model = new FiltersModel();
        this.filtersUpdater = new Subject<FiltersModel>();
        this.filters = this.filtersUpdater.publishBehavior(this.model).refCount();
    }
    public filtersChanged() {
        this.filtersUpdater.next(this.model);
    }
}

export class FiltersModel {
    public openOnly: boolean;

    constructor() {
        this.openOnly = false;
    }
}