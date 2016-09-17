import {Component, Input, Output} from '@angular/core'

declare var jQuery: any

@Component({
    template: require('./segment.component.html'),
    selector: 'segment'
})
export class SegmentComponent {
    @Input() withhelp: boolean
    @Input() helpid: string
    @Input() collapsed: boolean
    @Input() header: string
    @Input() fit: boolean
    @Input() collapsable: boolean = true

    constructor() {}

    collapse() {
        this.collapsed = !this.collapsed
    }

    showHelp() {
        jQuery('#' + this.helpid).modal('show')
    }

}
