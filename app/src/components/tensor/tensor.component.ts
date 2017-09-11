import {Component, Input} from '@angular/core'

import {MomentTensor} from '../../model/momenttensor.model'
import {MomentTensorService, USGSView} from '../../services/momenttensor.service'
import {SpinnerComponent} from '../spinner/spinner.component'
import {CheckboxComponent} from '../checkbox/checkbox.component'

@Component({
    template: require('./tensor.component.html'),
    selector: 'tensor',
    directives: [SpinnerComponent, CheckboxComponent]
})
export class TensorComponent {
    @Input() isCartesian: boolean
    momentTensor: MomentTensor
    usgsView: USGSView
    modeSelectorText: string = 'Pick USGS event'
    constructor(private momentTensorService: MomentTensorService) {
        this.momentTensorService.usgsViewSubject.subscribe(usgsView => {
            this.usgsView = usgsView
            this.modeSelectorText = this.usgsView.isUSGSView ? 'Use manual entries' : 'Pick USGS event'

        })
        this.momentTensorService.polygonizedMomentTensorSubject.subscribe(mt => this.momentTensor = mt.momentTensor)
    }

    pickUSGS() {
        this.momentTensorService.toggleUSGSView()
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

    
    updateStrike(value: number) {		
        this.momentTensorService.updateStrike(value)		
    }		
        		
    updateRake(value: number) {		
        this.momentTensorService.updateRake(value)		
    }		

    updateDip(value: number) {		
        this.momentTensorService.updateDip(value)		
    }

    toggleUseSDR(checked) {
        this.momentTensorService.toggleUseSDR(checked)
    }

}
