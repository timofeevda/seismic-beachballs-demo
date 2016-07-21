import {Component, Input, Output} from '@angular/core'

@Component({
    template: `
    <div class="ui modal" id="{{id}}">
        <i class="close icon"></i>
        <div class="header">{{header}}</div>
        <div class="content">
            <div class="description">
                <ng-content></ng-content>
            </div>
        </div>
    </div>`,
    selector: 'helpopup'
})
export class HelpPopupComponent {
    @Input() header: string
    @Input() id: string

    constructor() { }

}