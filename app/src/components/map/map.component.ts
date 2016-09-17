import {Component, Input, ViewChild, ElementRef} from '@angular/core'

import {Subscription} from 'rxjs'
import * as ol from 'openlayers'

import {CartesianMomentTensor, SphericalMomentTensor} from 'seismic-beachballs'
import {USGSQueryService} from '../../services/usgsquery.service'
import {USGSQueryComponent} from '../usgsquery/usgsquery.component'
import {BeachBallCanvasRendererService} from '../../services/beachballrenderer.service'
import {MomentTensorService} from '../../services/momenttensor.service'
import {USGSEvent} from '../../model/usgsevent.model'
import {FeaturePopupComponent} from './featurepopup.component'

@Component({
    template: require('./map.component.html'),
    selector: 'map',
    directives: [USGSQueryComponent, FeaturePopupComponent]
})
export class MapComponent {
    @ViewChild('featurepopup') popup: FeaturePopupComponent
    @ViewChild('map') mapElement: ElementRef
    map: ol.Map
    eventLoaderOverlays: { [key: string]: ol.Overlay }
    eventPopupOverlay: ol.Overlay
    selectableFeatures: ol.source.Vector
    eventsSubscription: Subscription
    selectedEventSubcription: Subscription
    searching: boolean = false

    constructor(private usgsquery: USGSQueryService, private momenttensorService: MomentTensorService,
        private beachballsCanvasRenderer: BeachBallCanvasRendererService) {
        this.eventLoaderOverlays = {}
        this.selectableFeatures = new ol.source.Vector({})
    }

    ngOnDestroy() {
        this.eventsSubscription.unsubscribe()
        this.selectedEventSubcription.unsubscribe()
    }

    ngAfterViewInit() {
        this.eventPopupOverlay = new ol.Overlay({
            element: this.popup.getPopupElement()
        })

        this.map = new ol.Map({
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                new ol.layer.Vector({
                    source: this.selectableFeatures
                })
            ],
            overlays: [
                this.eventPopupOverlay
            ],
            target: 'map',
            view: new ol.View({
                center: [0, 0],
                zoom: 1
            })
        })


        this.eventsSubscription = this.usgsquery.usgsEvents.subscribe(usgsEvents => {
            this.removeOverlays()
            this.selectableFeatures.clear()
            this.searching = !!usgsEvents['empty']
            if (!this.searching) {
                Object.keys(usgsEvents).map(key => usgsEvents[key]).forEach(event => {
                    if (!event.fetched) {
                        this.addLoadingOverlay(event.id, event.longitude, event.latitude)
                    } else {
                        this.addEventFeature(event)
                    }
                })
            }
        })

        this.map.on('click', (event) => {
            let usgsEvent: USGSEvent
            this.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
                if (!usgsEvent) {
                    usgsEvent = this.usgsquery.usgsEvents.getValue()[feature.getProperties()['id']]
                }
            })          
            this.usgsquery.selectedUSGSEvent.next(usgsEvent ? usgsEvent : this.usgsquery.emptySelectedEvent)
        })

        this.map.on('mousemove', (event) => {
            let usgsEvent: USGSEvent
            this.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
                if (!usgsEvent) {
                    usgsEvent = this.usgsquery.usgsEvents.getValue()[feature.getProperties()['id']]
                }
            })
            this.mapElement.nativeElement.style.cursor = usgsEvent ? 'pointer' : ''
        })

        this.selectedEventSubcription = this.usgsquery.selectedUSGSEvent.subscribe(usgsEvent => {            
            if (usgsEvent != this.usgsquery.emptySelectedEvent) {
                let coordinate = ol.proj.transform([usgsEvent.longitude, usgsEvent.latitude], 'EPSG:4326', 'EPSG:3857')
                this.map.getView().setCenter(coordinate)
                this.eventPopupOverlay.setPosition(coordinate)
            }
        })
    }

    private addEventFeature(event: USGSEvent) {
        let selectableFeature = new ol.Feature(new ol.geom.Point(ol.proj.transform([event.longitude, event.latitude], 'EPSG:4326', 'EPSG:3857')))
        let selectableFeatureStyle = new ol.style.Style({
            image: new ol.style.Icon({
                img: this.beachballsCanvasRenderer.renderBeachBall(event),
                imgSize: [32, 32]
            })
        })
        selectableFeature.setStyle(selectableFeatureStyle)
        selectableFeature.setProperties({ id: event.id })
        this.selectableFeatures.addFeature(selectableFeature)
    }

    private addLoadingOverlay(id: string, lon: number, lat: number) {
        let overlayDiv = document.createElement("div")
        overlayDiv.setAttribute("id", id)
        overlayDiv.setAttribute("class", "loading-overlay")
        document.getElementById("loading-overlays").appendChild(overlayDiv)
        let overlay = new ol.Overlay({
            position: ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'),
            offset: [-24, -24],
            element: overlayDiv,
            stopEvent: false
        })
        this.eventLoaderOverlays[id] = overlay
        this.map.addOverlay(overlay)
    }

    private removeOverlays() {
        for (let ol in this.eventLoaderOverlays) {
            this.map.removeOverlay(this.eventLoaderOverlays[ol])
        }
        this.eventLoaderOverlays = {}
    }

}