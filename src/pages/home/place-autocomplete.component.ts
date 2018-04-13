import { Component, NgZone, OnInit, Input } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

import { ViewController } from 'ionic-angular';
import { PlaceModel } from '../../app/services/places.service';
declare var google: any;
@Component({
  selector: 'place-autocomplete',
  templateUrl: 'place-autocomplete.component.html'
})
export class PlaceAutocompleteComponent implements OnInit {
  @Input() public place: PlaceModel;

  constructor(public viewCtrl: ViewController,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
  }

  ngOnInit() {
    this.handlePlacesAutocomplete();
  }

  public handlePlacesAutocomplete() {
    this.mapsAPILoader.load().then(() => {
      let search = document.querySelector('#search-' + this.place.id + ' input');
      search["value"] = this.place.adress;
      if (this.place.adress) {
        search.parentElement.parentElement.parentElement.parentElement.classList.add('item-input-has-value');
      }
      let autocomplete = new google.maps.places.Autocomplete(search, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.setPosition(search["value"], place.geometry.location.lat(), place.geometry.location.lng());
        });
      });
    });
  }

  private setPosition(adress: string, lat: number, lng: number) {
    this.place.position = { latitude: lat, longitude: lng };
    this.place.isAquired = true;
    this.place.adress = adress;
  }
}
