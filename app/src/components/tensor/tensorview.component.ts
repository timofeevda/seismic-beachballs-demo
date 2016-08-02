import {Component, ViewChild} from '@angular/core'

import {MomentTensor} from '../../model/momenttensor.model'
import {MomentTensorService} from '../../services/momenttensor.service'
import {CheckboxComponent} from '../checkbox/checkbox.component'
import {RadioComponent} from '../radio/radio.component'
import {SegmentComponent} from '../segment/segment.component'

@Component({
    template: require('./tensorview.component.html'),
    selector: 'tensorview',
    directives: [CheckboxComponent, RadioComponent, SegmentComponent]
})
export class TensorViewComponent {
    @ViewChild("fullsphere") fullSphere: RadioComponent
    @ViewChild("lowerhemisphere") lowerHemisphere: RadioComponent
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

    toggleLowerHemisphere() {
        let lowerHemisphere = !this.momentTensorService.currentTensor.momentTensorView.lowerHemisphere
        this.momentTensorService.toggleLowerHemisphere()
        this.fullSphere.setCheckedView(!lowerHemisphere)
        this.lowerHemisphere.setCheckedView(lowerHemisphere)
    }

}
