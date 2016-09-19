import {Component, Input, ViewChild, ElementRef} from '@angular/core'
import {Http, Response } from '@angular/http'

import {Observable, Subscription} from 'rxjs'

import {USGSQueryService, USGSQueryModel} from '../../services/usgsquery.service'
import {USGSEvent} from '../../model/usgsevent.model'
import {ProgressComponent} from '../progress/progress.component'

@Component({
    templateUrl: 'app/src/components/usgsquery/usgsquery.component.html',
    selector: 'usgsquery',
    directives: [ProgressComponent]
})
export class USGSQueryComponent {
    @ViewChild('progress') progress: ProgressComponent
    @ViewChild('searchbutton') searchbutton: ElementRef
    queryModel: USGSQueryModel
    usgsEventsSubscription: Subscription
    searchResultsSubscription: Subscription
    zeroResults: boolean = false
    constructor(private usgsqueryService: USGSQueryService) {
        usgsqueryService.queryParameters.subscribe(queryParameters => this.queryModel = queryParameters)
    }

    private onSearchStart() {
        this.searchbutton.nativeElement.disabled = true
        this.progress.reset()
    }

    private onEventsFetchProgress(usgsEvents: { [key: string]: USGSEvent }) {
        let features = Object.keys(usgsEvents).map(key => usgsEvents[key])
        let overall = features.length
        let progress = features.filter(feature => feature.fetched).length
        this.progress.setOverall(overall)
        this.progress.setProgress(progress)
        this.searchbutton.nativeElement.disabled = !(progress === overall)
    }

    ngAfterViewInit() {
        this.usgsEventsSubscription = this.usgsqueryService.usgsEvents.subscribe(usgsEvents => {
            if (usgsEvents['empty']) {
                this.onSearchStart()
            } else {
                this.onEventsFetchProgress(usgsEvents)
            }
        })
    }

    ngOnDestroy() {
        this.usgsEventsSubscription.unsubscribe()
        if (this.searchResultsSubscription) {
            this.searchResultsSubscription.unsubscribe()
        }
    }

    searchUSGS() {
        this.usgsqueryService.query(this.queryModel.starttime, this.queryModel.endtime, this.queryModel.limit + '')
        this.searchResultsSubscription = this.usgsqueryService.usgsEvents
            .subscribe(usgsEvents => this.zeroResults = Object.keys(usgsEvents).length === 0)
    }

}