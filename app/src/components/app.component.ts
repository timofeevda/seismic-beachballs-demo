import {Component, Input} from '@angular/core'

import {CartesianMomentTensor, SphericalMomentTensor} from 'seismic-beachballs'

import {TensorComponent} from './tensor/tensor.component'
import {SdrComponent} from './tensor/sdr.component'
import {SegmentComponent} from './segment/segment.component'
import {MomentTensor} from '../model/momenttensor.model'
import {MomentTensorService, USGSView} from '../services/momenttensor.service'
import {FullTensorSceneComponent} from './tensor/fulltensorscene.component'
import {ProjectedTensorSceneComponent} from './tensor/projectedtensorscene.component'
import {DoubleCoupleSceneComponent} from './tensor/doublecouplescene.component'
import {TensorViewComponent} from './tensor/tensorview.component'
import {HelpPopupComponent} from './helpopup/helpopup.component'
import {MapComponent} from './map/map.component'
import {USGSQueryComponent} from './usgsquery/usgsquery.component'
import {USGSQueryService} from '../services/usgsquery.service'
import {BeachBallCanvasRendererService} from '../services/beachballrenderer.service'

@Component({
    templateUrl: 'app/src/components/app.component.html',
    selector: 'tensor-app',
    directives: [SegmentComponent, TensorComponent, SdrComponent,
        FullTensorSceneComponent, ProjectedTensorSceneComponent,
        DoubleCoupleSceneComponent, TensorViewComponent, HelpPopupComponent, MapComponent, USGSQueryComponent],
    inputs: ['cartesianTensor', 'sphericalTensor'],
    providers: [MomentTensorService, USGSQueryService, BeachBallCanvasRendererService]
})
export class AppComponent {
    @Input() cartesianTensor: CartesianMomentTensor
    @Input() sphericalTensor: SphericalMomentTensor
    momentTensor: MomentTensor
    usgsView: USGSView 

    constructor(private momentTensorService: MomentTensorService) { }

    ngOnInit() {
        this.momentTensorService.usgsViewSubject.subscribe(usgsView => this.usgsView = usgsView)
        this.momentTensorService.polygonizedMomentTensorSubject.subscribe(mt => this.momentTensor = mt.momentTensor)
    }
}
