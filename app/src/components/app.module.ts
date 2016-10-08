import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import {ScientificNotationPipe} from '../pipes/scientificnotation.pipe'

import {AppComponent}  from './app.component';
import {TensorComponent} from './tensor/tensor.component'
import {SdrComponent} from './tensor/sdr.component'
import {SegmentComponent} from './segment/segment.component'
import {MomentTensor} from '../model/momenttensor.model'
import {MomentTensorService, USGSView} from '../services/momenttensor.service'
import {FullTensorSceneComponent} from './tensor/fulltensorscene.component'
import {ProjectedTensorSceneComponent} from './tensor/projectedtensorscene.component'
import {ThreeDoubleCoupleSceneComponent} from './tensor/threedoublecouplescene.component'
import {TensorViewComponent} from './tensor/tensorview.component'
import {HelpPopupComponent} from './helpopup/helpopup.component'
import {MapComponent} from './map/map.component'
import {USGSQueryComponent} from './usgsquery/usgsquery.component'
import {ProgressComponent} from './progress/progress.component'
import {FeaturePopupComponent} from './map/featurepopup.component'
import {SpinnerComponent} from './spinner/spinner.component'
import {CheckboxComponent} from './checkbox/checkbox.component'
import {RadioComponent} from './radio/radio.component'

@NgModule({
  imports: [BrowserModule, FormsModule, HttpModule],
  declarations: [ AppComponent, SegmentComponent, TensorComponent, SdrComponent,
        FullTensorSceneComponent, ProjectedTensorSceneComponent,
        ThreeDoubleCoupleSceneComponent, TensorViewComponent, HelpPopupComponent, FeaturePopupComponent, MapComponent, USGSQueryComponent,
        ScientificNotationPipe, ProgressComponent, SpinnerComponent, CheckboxComponent, RadioComponent],        
  bootstrap: [ AppComponent ]
})
export class AppModule { }