import {Component, Input} from '@angular/core'

@Component({
    template: require('./helpopup.component.html'),
    selector: 'helpopup'
})
export class HelpPopupComponent {
    @Input() header: string
    @Input() id: string
}