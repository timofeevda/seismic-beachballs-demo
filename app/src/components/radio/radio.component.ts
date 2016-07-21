import {Component, EventEmitter, ViewChild, ElementRef, Input, Output} from '@angular/core'

@Component({
    template: require('./radio.component.html'),
    selector: 'radio'
})
export class RadioComponent {
    @Input() label: string
    @Input() checked: boolean
    @Output() onChecked: EventEmitter<boolean>
    @ViewChild("input") input: ElementRef

    constructor() {
        this.onChecked = new EventEmitter<boolean>()
    }

    check() {
        if (!this.checked) {
            this.checked = true
            this.onChecked.emit(this.checked)
        }
    }

    setCheckedView(checked: boolean) {
        this.input.nativeElement.checked = checked
    }

    getChecked() {
        return this.checked ? "" : null
    }
}
