import {Component} from '@angular/core';

import {MomentTensor} from '../../model/momenttensor.model'
import {MomentTensorService} from '../../services/momenttensor.service'
import {SpinnerComponent} from '../spinner/spinner.component'

@Component({
    template: require('./sdr.component.html'),
    selector: 'sdr',
    directives: [SpinnerComponent]
})
export class SdrComponent {
    momentTensor: MomentTensor

    constructor(private momentTensorService: MomentTensorService) {
        this.momentTensorService.polygonizedMomentTensorSubject.subscribe(mt => this.momentTensor = mt.momentTensor)
    }

    updateStrike(value: number) {
        this.momentTensorService.updateStrike(value)
    }

    updateRake(value: number) {
        this.momentTensorService.updateRake(value)
    }

    updateDip(value: number) {
        this.momentTensorService.updateDip(value)
    }

}
