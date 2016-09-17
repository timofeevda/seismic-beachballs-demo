import { Injectable } from '@angular/core'
import {Http, Response } from '@angular/http'
import {Subject, BehaviorSubject, Observable} from 'rxjs'

import {USGSEvent} from '../model/usgsevent.model'

export class USGSQueryModel {
    constructor(public starttime: string, public endtime: string, public limit: number) { }
}

@Injectable()
export class USGSQueryService {
    private detailURLsCache: { [key: string]: USGSEvent } = {}    
    private usgsEventsQuerySubject: BehaviorSubject<any[]>
    private requestPrefix: string = `http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&producttype=moment-tensor&reviewstatus=reviewed&orderby=time&`    
    emptyEvents: { [key: string]: USGSEvent } = { 'empty': new USGSEvent('', '', 0, 0, '') }
    emptySelectedEvent: USGSEvent = new USGSEvent('', '', 0, 0, '')
    usgsEvents: BehaviorSubject<{ [key: string]: USGSEvent }>
    selectedUSGSEvent: BehaviorSubject<USGSEvent> 
    pickedUSGSEvent: BehaviorSubject<USGSEvent>
    queryParameters: BehaviorSubject<USGSQueryModel>

    constructor(private http: Http) {
        this.queryParameters = new BehaviorSubject(new USGSQueryModel("2010-01-01", "2014-01-02", 50))
        this.selectedUSGSEvent = new BehaviorSubject(this.emptySelectedEvent)
        this.pickedUSGSEvent = new BehaviorSubject(this.emptySelectedEvent)
        
        this.usgsEvents = new BehaviorSubject(this.emptyEvents)
        
        this.usgsEventsQuerySubject = new BehaviorSubject([])
        
        this.usgsEventsQuerySubject
            .map(this.toUSGSEvents).subscribe(usgsEvents => this.usgsEvents.next(usgsEvents))

        this.usgsEventsQuerySubject
            .map(this.toUSGSEvents)
            .flatMap(usgsEvents => this.createEventDetailsObservable(usgsEvents))
            .flatMap(usgsEvent => this.detailURLsCache[usgsEvent.id] ? Observable.of(this.detailURLsCache[usgsEvent.id]) : this.http.get(usgsEvent.detail).catch(this.handleError).map((res: Response) => res.json()))
            .subscribe(details => {
                this.detailURLsCache[details.id] = details
                let events = this.usgsEvents.getValue()
                let fetchedEvent = new USGSEvent(
                    details.id,
                    details.properties.place,
                    details.geometry.coordinates[0],
                    details.geometry.coordinates[1],
                    details.properties.url,
                    true)
                let momentTensorProperties = details.properties.products['moment-tensor'][0].properties
                fetchedEvent.Mpp = parseFloat(momentTensorProperties['tensor-mpp'])
                fetchedEvent.Mrp = parseFloat(momentTensorProperties['tensor-mrp'])
                fetchedEvent.Mrr = parseFloat(momentTensorProperties['tensor-mrr'])
                fetchedEvent.Mrt = parseFloat(momentTensorProperties['tensor-mrt'])
                fetchedEvent.Mtt = parseFloat(momentTensorProperties['tensor-mtt'])
                fetchedEvent.Mtp = parseFloat(momentTensorProperties['tensor-mtp'])
                fetchedEvent.Mscalar = parseFloat(momentTensorProperties['scalar-moment'])
                events[details.id] = fetchedEvent
                this.usgsEvents.next(events)
            })
    }

    pickUSGSEvent() {
        this.pickedUSGSEvent.next(this.selectedUSGSEvent.getValue())
    }

    selectUSGSEvent(usgsEvent: USGSEvent) {
        this.selectedUSGSEvent.next(usgsEvent)
    }

    query(starttime: string, endtime: string, limit: string) {
        this.usgsEvents.next(this.emptyEvents)
        this.selectedUSGSEvent.next(this.emptySelectedEvent)
        this.createHTTPQueryObservable(starttime, endtime, limit).subscribe(features => this.usgsEventsQuerySubject.next(features))
    }

    private createHTTPQueryObservable(starttime: string, endtime: string, limit: string): Observable<any[]> {
        return this.http
            .get(this.requestPrefix + 'starttime=' + starttime + '&endtime=' + endtime + '&limit=' + limit)
            .map(this.extractData)
    }

    private toUSGSEvents(features: any[]): { [key: string]: USGSEvent } {
        let eventsMap: { [key: string]: USGSEvent } = {}
        return features
            .map(feature => new USGSEvent(
                feature.id,
                feature.properties.place,
                feature.geometry.coordinates[0],
                feature.geometry.coordinates[1],
                feature.properties.detail))
            .reduce((acc, feature) => {
                acc[feature.id] = feature
                return acc
            }, eventsMap)
    }

    private createEventDetailsObservable(usgsEvents: { [key: string]: USGSEvent }): Observable<USGSEvent> {
        let detailsUrlCache = this.detailURLsCache
        let features = Object.keys(usgsEvents).map(key => usgsEvents[key]).reverse()
        let timeout = -1
        let observeFunction = (features: USGSEvent[], observer) => {
            let feature = features.pop()
            if (feature) {
                observer.next(feature)
                let timeout = 100
                if (features.length > 0) {
                    timeout = detailsUrlCache[features[features.length - 1].id] ? 0 : 100
                }
                timeout = window.setTimeout(() => observeFunction(features, observer), timeout)
            } else {
                observer.complete()
            }
        }
        return Observable.create((observer) => {
            timeout = window.setTimeout(() => observeFunction(features, observer), 100)
            return () => {
                if (timeout !== -1) {
                    window.clearTimeout(timeout)
                }
            }
        })
    }

    private extractData(res: Response) {
        let body = res.json()
        return body.features || []
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error'
        console.error(errMsg)
        return Observable.throw(errMsg)
    }
}