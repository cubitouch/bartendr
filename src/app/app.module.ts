import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { BarPage } from '../pages/bar/bar';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarRepository } from './services/bars.repository';
import { LocationService } from './services/location.service';
import { TimeService } from './services/time.service';
import { FiltersPage } from '../pages/home/filters';
import { FiltersService } from './services/filters.service';
import { MeetingPage } from '../pages/home/meeting';
import { PlaceAutocompleteComponent } from '../pages/home/place-autocomplete.component';
import { MapComponent } from '../pages/home/map.component';
import { PlacesService } from './services/places.service';
import { BarathonService } from './services/barathon.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FiltersPage,
    MeetingPage,
    AboutPage,
    BarPage,
    PlaceAutocompleteComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, { backButtonText: 'Retour' }, {
      links: [
        { component: HomePage, name: 'Home', segment: 'home' },
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: BarPage, name: 'Bar', segment: 'bars/:id', defaultHistory: [HomePage] }
      ]
    }),
    IonicStorageModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD61F5jFB_8ql02dWz6ql73Ve076nTEuQE',
      libraries: ["places"]
    }),
    AgmJsMarkerClustererModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FiltersPage,
    MeetingPage,
    AboutPage,
    BarPage,
    PlaceAutocompleteComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BarRepository,
    LocationService,
    TimeService,
    FiltersService,
    PlacesService,
    BarathonService,
    GoogleMapsAPIWrapper,
  ]
})
export class AppModule { }
