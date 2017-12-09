

import { Observable } from "rxjs/Observable";
import moment from 'moment';
import { LocationService } from '../services/location.service';
import { TimeService } from "../services/time.service";

export class BarModel {
    public id: number;
    public name: string;
    public picture: string;
    public isChecked: boolean;

    public adress: string;
    public latitude: number;
    public longitude: number;
    public distance: Observable<number>;
    public time: Observable<number>;

    public schedule: ScheduleModel;

    constructor(private timeService: TimeService) {
        this.schedule = new ScheduleModel(timeService);
    }

    public static from(data: any, locationService: LocationService, timeService: TimeService): BarModel {
        const model = new BarModel(timeService);

        if (data) {
            model.id = parseInt(data.Id);
            model.name = data.Nom;
            const pictureUrl: string = data.Photo;
            model.picture = pictureUrl.substring(pictureUrl.indexOf('(') + 1, pictureUrl.indexOf(')'));
            model.isChecked = !!data.Vérifié;
            model.adress = data.Adresse;
            model.latitude = parseFloat((data.Latitude as string).replace(',', '.'));
            model.longitude = parseFloat((data.Longitude as string).replace(',', '.'));

            model.schedule.addOpeningTime(data.Lundi, DayOfWeek.Monday);
            model.schedule.addOpeningTime(data.Mardi, DayOfWeek.Tuesday);
            model.schedule.addOpeningTime(data.Mercredi, DayOfWeek.Wednesday);
            model.schedule.addOpeningTime(data.Jeudi, DayOfWeek.Thursday);
            model.schedule.addOpeningTime(data.Vendredi, DayOfWeek.Friday);
            model.schedule.addOpeningTime(data.Samedi, DayOfWeek.Saturday);
            model.schedule.addOpeningTime(data.Dimanche, DayOfWeek.Sunday);

            model.distance = locationService.getDistance(model);
            model.time = model.distance.map(distance => distance / 4 * 60);
        }

        return model;
    }

    public static fromList(data: any[], locationService: LocationService, timeService: TimeService): BarModel[] {
        const models = new Array<BarModel>();

        if (data) {
            data.forEach(item => models.push(BarModel.from(item, locationService, timeService)));
        }

        return models;
    }
}

export enum DayOfWeek {
    Monday = 1,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
}
function getDayOfWeekLabel(value: DayOfWeek) {
    switch (value) {
        case DayOfWeek.Monday:
            return 'Lundi';
        case DayOfWeek.Tuesday:
            return 'Mardi';
        case DayOfWeek.Wednesday:
            return 'Mercerdi';
        case DayOfWeek.Thursday:
            return 'Jeudi';
        case DayOfWeek.Friday:
            return 'Vendredi';
        case DayOfWeek.Saturday:
            return 'Samedi';
        case DayOfWeek.Sunday:
            return 'Dimanche';
    }
}

export class ScheduleModel {
    public openingTimes: DayModel[];
    public isOpen: Observable<boolean>;

    constructor(private timeService: TimeService) {
        this.openingTimes = new Array<DayModel>();
    }

    public addOpeningTime(data, dayOfWeek) {
        this.openingTimes.push(DayModel.from(data, dayOfWeek, this.timeService));
    }

    public get monday(): DayModel {
        return this.openingTimes.find(d => d.dayOfWeek == DayOfWeek.Monday);
    }
    public get tuesday(): DayModel {
        return this.openingTimes.find(d => d.dayOfWeek == DayOfWeek.Tuesday);
    }
    public get wednesday(): DayModel {
        return this.openingTimes.find(d => d.dayOfWeek == DayOfWeek.Wednesday);
    }
    public get thursday(): DayModel {
        return this.openingTimes.find(d => d.dayOfWeek == DayOfWeek.Thursday);
    }
    public get friday(): DayModel {
        return this.openingTimes.find(d => d.dayOfWeek == DayOfWeek.Friday);
    }
    public get saturday(): DayModel {
        return this.openingTimes.find(d => d.dayOfWeek == DayOfWeek.Saturday);
    }
    public get sunday(): DayModel {
        return this.openingTimes.find(d => d.dayOfWeek == DayOfWeek.Sunday);
    }

    public get isOpenNow(): Observable<boolean> {
        return this.timeService.time.map(now => {
            const schedule: DayModel = this.openingTimes.find(ot => ot.dayOfWeek == now.getDay());

            // bar is closed
            if (schedule == null)
                return false;

            // bar is open
            if (schedule.workingHours.filter(h => h.getIsInInterval(now)).length > 0)
                return true;

            // bar is not open yet
            return false;
        });
    }
}

export class DayModel {
    public dayOfWeek: DayOfWeek;
    public label: string;
    public isOpen: Observable<boolean>;
    public isToday: Observable<boolean>;
    public workingHours: WorkingHoursModel[];

    public get hoursFormat(): string {
        if (this.workingHours.length == 0)
            return "Fermé";
        let format = "";
        this.workingHours.forEach(hour => {
            format += hour.startTime.format('HH[h]mm') + ' - ' + hour.endTime.format('HH[h]mm');
            if (hour != this.workingHours[this.workingHours.length - 1]) {
                format += " / ";
            }
        });
        return format;
    }
    public static from(data: string, dayOfWeek: DayOfWeek, timeService: TimeService): DayModel {
        const model = new DayModel();

        model.dayOfWeek = dayOfWeek;
        model.label = getDayOfWeekLabel(dayOfWeek);
        model.isOpen = timeService.time.map(now => model.workingHours.filter(h => h.getIsInInterval(now)).length > 0);
        model.isToday = timeService.day.map(d => d == dayOfWeek);
        model.workingHours = model.extractHours(data);

        return model;
    }

    private extractHours(hours: string): WorkingHoursModel[] {
        var intervals = new Array<WorkingHoursModel>();

        let formatedHours: string = hours.replace(" ", "");
        let services: string[] = formatedHours.split('/');

        services.forEach(service => {
            var times = service.split('-');
            if (times.length == 2)
                intervals.push(new WorkingHoursModel(times[0], times[1]));
        });

        return intervals;
    }
}

export class WorkingHoursModel {
    public startTime: moment.Moment;
    public endTime: moment.Moment;

    constructor(start: string, end: string) {
        this.startTime = moment(start, ["HH:mm"]);
        this.endTime = moment(end, ["HH:mm"]);
        if (this.endTime < this.startTime)
            this.endTime = this.endTime.add(1, 'day');
    }
    public getIsInInterval(time: Date): boolean {
        return moment(moment(time).format('HH:mm'), ["HH:mm"]).isBetween(this.startTime, this.endTime);
    }
}