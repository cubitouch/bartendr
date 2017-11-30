import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { BarPage } from '../pages/bar/bar';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarRepository } from './services/bars.repository';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AboutPage,
    BarPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: HomePage, name: 'Home', segment: 'home' },
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: BarPage, name: 'Bar', segment: 'bars/:id', defaultHistory: [HomePage] }
      ]
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD61F5jFB_8ql02dWz6ql73Ve076nTEuQE'
    }),
    AgmJsMarkerClustererModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AboutPage,
    BarPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BarRepository
  ]
})
export class AppModule { }
