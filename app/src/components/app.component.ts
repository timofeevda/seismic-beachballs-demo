import {Component, Input} from '@angular/core'
import {TensorComponent} from './tensor/tensor.component'
import {SdrComponent} from './tensor/sdr.component'
import {SegmentComponent} from './segment/segment.component'

import {CartesianMomentTensor, SphericalMomentTensor} from 'seismic-beachballs'
import {MomentTensor} from '../model/momenttensor.model'
import {MomentTensorService} from '../services/momenttensor.service'
import {FullTensorSceneComponent} from './tensor/fulltensorscene.component'
import {ProjectedTensorSceneComponent} from './tensor/projectedtensorscene.component'
import {DoubleCoupleSceneComponent} from './tensor/doublecouplescene.component'
import {TensorViewComponent} from './tensor/tensorview.component'
import {HelpPopupComponent} from './helpopup/helpopup.component'

@Component({
    templateUrl: 'app/src/components/app.component.html',
    selector: 'tensor-app',
    directives: [SegmentComponent, TensorComponent, SdrComponent,
        FullTensorSceneComponent, ProjectedTensorSceneComponent,
        DoubleCoupleSceneComponent, TensorViewComponent, HelpPopupComponent],
    inputs: ['cartesianTensor', 'sphericalTensor'],
    providers: [MomentTensorService]
})
export class AppComponent {
    @Input() cartesianTensor: CartesianMomentTensor
    @Input() sphericalTensor: SphericalMomentTensor
    momentTensor: MomentTensor

    constructor(private momentTensorService: MomentTensorService) { }

    ngOnInit() {
        this.momentTensorService.polygonizedMomentTensorSubject.subscribe(mt => this.momentTensor = mt.momentTensor)
    }
}
