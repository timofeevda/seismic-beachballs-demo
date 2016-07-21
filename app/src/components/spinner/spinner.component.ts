import {Component, EventEmitter, Input, Output} from '@angular/core'

@Component({
    templateUrl: 'app/src/components/spinner/spinner.component.html',
    selector: 'spinner'
})
export class SpinnerComponent {
    @Input() value: number
    @Output() valueChange: EventEmitter<number>    
    @Input() step: number = 0.1
    timeout: number
    
    constructor() {
        this.valueChange = new EventEmitter<any>()
    }

    onChange(value: number) {
        this.value = value
        this.valueChange.emit(this.value)
    }

    startSpinUp() {
        this.timeout = window.setTimeout(() => {
            this.stepUp()
            this.startSpinUp()
        }, 100);      
    }

    stopSpin() {
        clearTimeout(this.timeout)
    }

    startSpinDown() {
        this.timeout = window.setTimeout(() => { 
            this.stepDown()
            this.startSpinDown()
        }, 100);
    }

    stepUp() {
        this.stepValue(this.step)
    }

    stepDown() {
        this.stepValue(-this.step)
    }

    stepValue(step: number) {
        this.value += step
        this.valueChange.emit(this.value)
    }

}