import {Component, ViewChild} from '@angular/core'

import {MomentTensor} from '../../model/momenttensor.model'
import {MomentTensorService} from '../../services/momenttensor.service'
import {RadioComponent} from '../radio/radio.component'
import {SegmentComponent} from '../segment/segment.component'
import {CheckboxComponent} from '../checkbox/checkbox.component'

@Component({
    template: require('./tensorview.component.html'),
    selector: 'tensorview'
})
export class TensorViewComponent {
    @ViewChild("upperhemisphere") fullSphere: CheckboxComponent
    @ViewChild("lowerhemisphere") lowerHemisphere: CheckboxComponent
    momentTensor: MomentTensor

    constructor(private momentTensorService: MomentTensorService) {
        this.momentTensorService.polygonizedMomentTensorSubject.subscribe(mt => this.momentTensor = mt.momentTensor)
    }

    toggleBAxis(checked: boolean) {
        this.momentTensorService.toggleBAxis(checked)
    }

    togglePAxis(checked: boolean) {
        this.momentTensorService.togglePAxis(checked)
    }

    toggleTAxis(checked: boolean) {
        this.momentTensorService.toggleTAxis(checked)
    }

    toggleFaultPlane(checked: boolean) {
        this.momentTensorService.toggleFaultPlane(checked)
    }

    toggleAuxPlane(checked: boolean) {
        this.momentTensorService.toggleAuxPlane(checked)
    }

    toggleHorPlane(checked: boolean) {
        this.momentTensorService.toggleHorPlane(checked)
    }

    toggleMeshView(checked: boolean) {
        this.momentTensorService.toggleMesh(checked)
    }

    toggleLowerHemisphere(checked) {
        this.momentTensorService.toggleLowerHemisphere(checked)
    }

    toggleUpperHemisphere(checked) {
        this.momentTensorService.toggleUpperHemisphere(checked)
    }

}
