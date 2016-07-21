import {Component, EventEmitter, Input, Output} from '@angular/core'

@Component({
    template: require('./checkbox.component.html'),
    selector: 'checkbox'
})
export class CheckboxComponent {
    @Input() label: string
    @Input() checked: boolean
    @Output() onChecked: EventEmitter<boolean>

    constructor() {
        this.onChecked = new EventEmitter<boolean>()
    }

    check() {
        this.checked = !this.checked
        this.onChecked.emit(this.checked)
    }

    getChecked() {
        return this.checked ? "" : null
    }
}
