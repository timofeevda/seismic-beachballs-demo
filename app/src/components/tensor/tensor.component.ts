import {Component, Input} from '@angular/core'

import {MomentTensor} from '../../model/momenttensor.model'
import {MomentTensorService} from '../../services/momenttensor.service'
import {SpinnerComponent} from '../spinner/spinner.component'

@Component({
    templateUrl: 'app/src/components/tensor/tensor.component.html',
    selector: 'tensor',
    directives: [SpinnerComponent]
})
export class TensorComponent {
    @Input() isCartesian: boolean
    momentTensor: MomentTensor

    constructor(private momentTensorService: MomentTensorService) {
        this.momentTensorService.momentTensorSubject.subscribe(mt => this.momentTensor = mt)
    }

    updateMxy(val: number) {
        if (this.isCartesian) {
            this.momentTensorService.updateXYTP(val, -val)
        } else {
            this.momentTensorService.updateXYTP(-val, val)
        }
    }

    updateMyz(val: number) {
        if (this.isCartesian) {
            this.momentTensorService.updateYZRP(val, -val)
        } else {
            this.momentTensorService.updateYZRP(-val, val)
        }
    }

    updateMzz(val: number) {
        this.momentTensorService.updateZZRR(val)
    }

    updateMxx(val: number) {
        this.momentTensorService.updateXXTT(val)
    }

    updateMxz(val: number) {
        this.momentTensorService.updateXZRT(val)
    }

    updateMyy(val: number) {
        this.momentTensorService.updateYYPP(val)
    }
}