import {Component, Input, ViewChild, ElementRef} from '@angular/core'

import {Subscription} from 'rxjs'
import * as ol from 'openlayers'

import {USGSEvent} from '../../model/usgsevent.model'
import {USGSQueryService} from '../../services/usgsquery.service'

@Component({
    selector: 'featurepopup',
    template: require('./featurepopup.component.html'),
})
export class FeaturePopupComponent {
    @ViewChild('popup') popup: ElementRef
    @ViewChild('popupcontent') popupContent: ElementRef
    @ViewChild('popupcloser') popupCloser: ElementRef
    usgsEvent: USGSEvent
    selectedEventSubscription: Subscription

    constructor(private usgsQueryService: USGSQueryService) {
        this.usgsEvent = usgsQueryService.emptySelectedEvent
    }

    ngAfterViewInit() {
        this.popupCloser.nativeElement.onclick = () => {
            this.setVisible(false)
            this.popupCloser.nativeElement.blur()
            this.usgsQueryService.selectUSGSEvent(this.usgsQueryService.emptySelectedEvent)
            return false
        }      
        this.selectedEventSubscription = this.usgsQueryService.selectedUSGSEvent.subscribe(usgsEvent => {
            this.usgsEvent = usgsEvent
            this.setVisible(usgsEvent != this.usgsQueryService.emptySelectedEvent)
        })         
    }

    ngOnDestroy() {
        this.selectedEventSubscription.unsubscribe()
    }
    
    getPopupElement(): HTMLElement {
        return this.popup.nativeElement
    }

    private pickTensor() {
        this.usgsQueryService.pickUSGSEvent()
    }

    private setVisible(visible: boolean) {
        this.getPopupElement().style.display = visible ? 'block' : 'none'
    }
}