import {bootstrap} from '@angular/platform-browser-dynamic'
import {enableProdMode} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {AppComponent} from './components/app.component'
import {MomentTensorService} from './services/momenttensor.service'
import {USGSQueryService} from './services/usgsquery.service'

enableProdMode()
bootstrap(AppComponent, [MomentTensorService, USGSQueryService, HTTP_PROVIDERS])