import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { BarModel } from "../models/bar.model";
import 'rxjs/add/operator/shareReplay';

@Injectable()
export class BarRepository {
    public bars: Observable<BarModel[]>;

    constructor(private http: HttpClient) {
        this.bars = this.http.get('./assets/bars.json')
        .map((data: any[]) => BarModel.fromList(data))
        .shareReplay();
    }

}
