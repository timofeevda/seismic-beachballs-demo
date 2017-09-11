import {Component, Input} from '@angular/core'

import {CartesianMomentTensor, SphericalMomentTensor} from 'seismic-beachballs'

import {MomentTensor} from '../model/momenttensor.model'
import {MomentTensorService, USGSView} from '../services/momenttensor.service'
import {USGSQueryService} from '../services/usgsquery.service'
import {BeachBallCanvasRendererService} from '../services/beachballrenderer.service'

@Component({
    templateUrl: 'app/src/components/app.component.html',
    selector: 'tensor-app',
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
