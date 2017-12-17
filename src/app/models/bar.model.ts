

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
    public distance: number;
    public time: number;

    public schedule: ScheduleModel;

    constructor(private now: Date) {
        this.schedule = new ScheduleModel(now);
    }

    public static from(data: any, locationService: LocationService, position: { latitude: number, longitude: number }, now: Date): BarModel {
        const model = new BarModel(now);


        if (data) {
            model.id = parseInt(data.Id);
            model.name = data.Nom;
            const pictureUrl: string = data.Photo;
            model.picture = pictureUrl.substring(pictureUrl.indexOf('(') + 1, pictureUrl.indexOf(')'));
            model.isChecked = !!data.Vérifié;
            model.adress = data.Adresse;
            model.latitude = parseFloat((data.Latitude as string).replace(',', '.'));
            model.longitude = parseFloat((data.Longitude as string).replace(',', '.'));

            model.schedule.addDay(data.Lundi, DayOfWeek.Monday);
            model.schedule.addDay(data.Mardi, DayOfWeek.Tuesday);
            model.schedule.addDay(data.Mercredi, DayOfWeek.Wednesday);
            model.schedule.addDay(data.Jeudi, DayOfWeek.Thursday);
            model.schedule.addDay(data.Vendredi, DayOfWeek.Friday);
            model.schedule.addDay(data.Samedi, DayOfWeek.Saturday);
            model.schedule.addDay(data.Dimanche, DayOfWeek.Sunday);

            model.distance = locationService.getDistance(model, position);
            model.time = model.distance / 4 * 60;
        }

        return model;
    }

    public static fromList(data: any[], locationService: LocationService, position: { latitude: number, longitude: number }, now: Date): BarModel[] {
        const models = new Array<BarModel>();

        if (data) {
            data.forEach(item => models.push(BarModel.from(item, locationService, position, now)));
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
function getDayOfWeekFromDay(value: number) {
    switch (value) {
        case 0:
            return DayOfWeek.Sunday;
        case 1:
            return DayOfWeek.Monday;
        case 2:
            return DayOfWeek.Tuesday;
        case 3:
            return DayOfWeek.Wednesday;
        case 4:
            return DayOfWeek.Thursday;
        case 5:
            return DayOfWeek.Friday;
        case 6:
            return DayOfWeek.Saturday;
    }
}

export class ScheduleModel {
    public days: DayModel[];

    constructor(private now: Date) {
        this.days = new Array<DayModel>();
    }

    public addDay(data, dayOfWeek) {
        this.days.push(DayModel.from(data, dayOfWeek, this.now));
    }

    public get monday(): DayModel {
        return this.days.find(d => d.dayOfWeek == DayOfWeek.Monday);
    }
    public get tuesday(): DayModel {
        return this.days.find(d => d.dayOfWeek == DayOfWeek.Tuesday);
    }
    public get wednesday(): DayModel {
        return this.days.find(d => d.dayOfWeek == DayOfWeek.Wednesday);
    }
    public get thursday(): DayModel {
        return this.days.find(d => d.dayOfWeek == DayOfWeek.Thursday);
    }
    public get friday(): DayModel {
        return this.days.find(d => d.dayOfWeek == DayOfWeek.Friday);
    }
    public get saturday(): DayModel {
        return this.days.find(d => d.dayOfWeek == DayOfWeek.Saturday);
    }
    public get sunday(): DayModel {
        return this.days.find(d => d.dayOfWeek == DayOfWeek.Sunday);
    }

    public get isOpenNow(): boolean {
        const day: DayModel = this.days.find(ot => ot.dayOfWeek == getDayOfWeekFromDay(this.now.getDay()));

        // bar is open
        return day.isOpen;
    }
}

export class DayModel {
    public dayOfWeek: DayOfWeek;
    public label: string;
    public isOpen: boolean;
    public isToday: boolean;
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
    public static from(data: string, dayOfWeek: DayOfWeek, now: Date): DayModel {
        const model = new DayModel();

        model.dayOfWeek = dayOfWeek;
        model.label = getDayOfWeekLabel(dayOfWeek);
        model.workingHours = model.extractHours(data);
        model.isOpen = model.workingHours.filter(h => h.getIsInInterval(now)).length > 0;
        model.isToday = now.getDay() == dayOfWeek;

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
        return moment(moment(time).format('HH:mm'), ["HH:mm"]).isBetween(this.startTime, this.endTime, null, '[]');
    }
}