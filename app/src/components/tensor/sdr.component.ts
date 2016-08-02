import {Component} from '@angular/core';

import {MomentTensor} from '../../model/momenttensor.model'
import {MomentTensorService} from '../../services/momenttensor.service'

@Component({
    template: require('./sdr.component.html'),
    selector: 'sdr',
    directives: []
})
export class SdrComponent {
    momentTensor: MomentTensor

    constructor(private momentTensorService: MomentTensorService) {
        this.momentTensorService.polygonizedMomentTensorSubject.subscribe(mt => this.momentTensor = mt.momentTensor)
    }

}
