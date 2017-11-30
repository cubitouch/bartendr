export class BarModel {
    public id: number;
    public name: string;
    public picture: string;
    public isChecked: boolean;

    public adress: string; 
    public latitude: number;
    public longitude: number;

    public schedule: HoraireModel;

    constructor() {
        this.schedule = new HoraireModel();
    }

    public static from(data: any): BarModel {
        const model = new BarModel();

        if (data) {
            model.id = parseInt(data.Id);
            model.name = data.Nom;
            const pictureUrl: string = data.Photo;
            model.picture = pictureUrl.substring(pictureUrl.indexOf('(') + 1, pictureUrl.indexOf(')'));
            model.isChecked = !!data.Vérifié;
            model.adress = data.Adresse;
            model.latitude = parseFloat((data.Latitude as string).replace(',', '.'));
            model.longitude = parseFloat((data.Longitude as string).replace(',', '.'));
            model.schedule.monday = data.Lundi;
            model.schedule.tuesday = data.Mardi;
            model.schedule.wednesday = data.Mercredi;
            model.schedule.thursday = data.Jeudi;
            model.schedule.friday = data.Vendredi;
            model.schedule.saturday = data.Samedi;
            model.schedule.sunday = data.Dimanche;
        }

        return model;
    }

    public static fromList(data: any[]): BarModel[] {
        const models = new Array<BarModel>();

        if (data) {
            data.forEach(item => models.push(BarModel.from(item)));
        }

        return models;
    }
}

export class HoraireModel {
    public monday: string;
    public tuesday: string;
    public wednesday: string;
    public thursday: string;
    public friday: string;
    public saturday: string;
    public sunday: string;
}