import {Component} from '@angular/core';

import {MomentTensor} from '../../model/momenttensor.model'
import {MomentTensorService} from '../../services/momenttensor.service'
import {SpinnerComponent} from '../spinner/spinner.component'

@Component({
    templateUrl: 'app/src/components/tensor/sdr.component.html',
    selector: 'sdr',
    directives: [SpinnerComponent]
})
export class SdrComponent {
    momentTensor: MomentTensor

    constructor(private momentTensorService: MomentTensorService) {
        this.momentTensorService.momentTensorSubject.subscribe(mt => this.momentTensor = mt)
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