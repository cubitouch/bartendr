import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/publishBehavior';
import 'rxjs/add/operator/publishReplay';

@Injectable()
export class BarathonService {
    public active: Observable<boolean>;
    public mapCenter: Observable<{ latitude: number, longitude: number }>;
    public barathonPosition: Observable<{ latitude: number, longitude: number }>;

    private activeChanged: Subject<boolean>;
    private mapCenterChanged: Subject<{ latitude: number, longitude: number }>;

    constructor() {
        this.activeChanged = new Subject<boolean>();
        this.active = this.activeChanged.publishBehavior(false).refCount();

        this.mapCenterChanged = new Subject<{ latitude: number, longitude: number }>();
        this.mapCenter = this.mapCenterChanged.publishBehavior(null).refCount();

        // should only change when it pass from false to true, then from true to false return null
        this.barathonPosition = this.active.withLatestFrom(this.mapCenter).map(([active, position]) => {
            if (active) {
                return position;
            }
            return null;
        });
    }

    public setActive(active: boolean) {
        this.activeChanged.next(active);
    }

    public setMapCenter(position: { latitude: number, longitude: number }) {
        this.mapCenterChanged.next(position);
    }
}