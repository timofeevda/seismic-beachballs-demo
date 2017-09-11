import { Injectable } from '@angular/core'
import {Subject, BehaviorSubject} from 'rxjs'
import * as beachballs from "seismic-beachballs"

import {MomentTensor, MomentTensorView} from '../model/momenttensor.model'
import {USGSQueryService} from './usgsquery.service'

export class USGSView {
    constructor(public isUSGSView: boolean = false) { }
}

export class PolygonizedMomentTensor {
    constructor(public momentTensor: MomentTensor, public polygons: { vertices: number[][], compressional: boolean }[]) { }
}

@Injectable()
export class MomentTensorService {
    polygonizedMomentTensorSubject: Subject<PolygonizedMomentTensor>
    currentTensor: MomentTensor
    usgsViewSubject: BehaviorSubject<USGSView>

    constructor(private usgsQueryService: USGSQueryService) {
        let sphericalTensor = { Mtt: 99, Mtp: 4, Mrt: 5.5, Mpp: -10, Mrp: 7, Mrr: -10 }
        let momentTensorView: MomentTensorView = { pAxis: true, tAxis: true, bAxis: true, faultPlane: true, auxPlane: true, horPlane: false, lowerHemisphere: true, upperHemisphere: true, showMesh: false, useSDR: false }
        this.currentTensor = new MomentTensor(momentTensorView, undefined, sphericalTensor)
        this.polygonizedMomentTensorSubject = new BehaviorSubject<PolygonizedMomentTensor>(this.createPolygonizedMomentTensor())
        this.usgsViewSubject = new BehaviorSubject(new USGSView())
        this.usgsQueryService.pickedUSGSEvent.subscribe(usgsEvent => {
            if (usgsEvent != this.usgsQueryService.emptySelectedEvent) {
                let scalar = usgsEvent.Mscalar
                this.updateTensorEntries(
                    usgsEvent.Mrr / scalar, usgsEvent.Mtt / scalar, usgsEvent.Mpp / scalar,
                    usgsEvent.Mrt / scalar, usgsEvent.Mrp / scalar, usgsEvent.Mtp / scalar)
                this.toggleUSGSView()
            }
        })
    }

    private createPolygonizedMomentTensor(): PolygonizedMomentTensor {
        return new PolygonizedMomentTensor(this.currentTensor, this.currentTensor.sdrComputationError ? [] : beachballs.beachBall(this.currentTensor))
    }

    updateTensorEntries(Mrr: number, Mtt: number, Mpp: number, Mrt: number, Mrp: number, Mtp: number) {
        this.currentTensor.Mrr = Mrr
        this.currentTensor.Mtt = Mtt
        this.currentTensor.Mpp = Mpp
        this.currentTensor.Mrt = Mrt
        this.currentTensor.Mrp = Mrp
        this.currentTensor.Mtp = Mtp
        this.updateSDRForTensor()
    }

    updateXYTP(xy: number, tp: number) {
        this.currentTensor.Mxy = xy
        this.currentTensor.Mtp = tp
        this.updateSDRForTensor()
    }

    updateYZRP(yz: number, rp: number) {
        this.currentTensor.Myz = yz
        this.currentTensor.Mrp = rp
        this.updateSDRForTensor()
    }

    updateZZRR(value: number) {
        this.currentTensor.Mzz = value
        this.currentTensor.Mrr = value
        this.updateSDRForTensor()
    }

    updateXXTT(value: number) {
        this.currentTensor.Mxx = value
        this.currentTensor.Mtt = value
        this.updateSDRForTensor()
    }

    updateYYPP(value: number) {
        this.currentTensor.Myy = value
        this.currentTensor.Mpp = value
        this.updateSDRForTensor()
    }

    updateXZRT(value: number) {
        this.currentTensor.Mxz = value
        this.currentTensor.Mrt = value
        this.updateSDRForTensor()
    }

    updateSDRForTensor() {
        this.currentTensor = new MomentTensor(this.currentTensor.momentTensorView, undefined, {
            Mpp: this.currentTensor.Mpp, Mrp: this.currentTensor.Mrp, Mrr: this.currentTensor.Mrr,
            Mrt: this.currentTensor.Mrt, Mtp: this.currentTensor.Mtp, Mtt: this.currentTensor.Mtt
        })
        this.polygonizedMomentTensorSubject.next(this.createPolygonizedMomentTensor())
    }

    toggleBAxis(checked: boolean) {
        this.currentTensor.momentTensorView.bAxis = checked
        this.fireModifiedTensor()
    }

    togglePAxis(checked: boolean) {
        this.currentTensor.momentTensorView.pAxis = checked
        this.fireModifiedTensor()
    }

    toggleTAxis(checked: boolean) {
        this.currentTensor.momentTensorView.tAxis = checked
        this.fireModifiedTensor()
    }

    toggleFaultPlane(checked: boolean) {
        this.currentTensor.momentTensorView.faultPlane = checked
        this.fireModifiedTensor()
    }

    toggleAuxPlane(checked: boolean) {
        this.currentTensor.momentTensorView.auxPlane = checked
        this.fireModifiedTensor()
    }

    toggleHorPlane(checked: boolean) {
        this.currentTensor.momentTensorView.horPlane = checked
        this.fireModifiedTensor()
    }

    toggleLowerHemisphere(checked: boolean) {
        this.currentTensor.momentTensorView.lowerHemisphere = checked
        this.fireModifiedTensor()
    }

    toggleUpperHemisphere(checked: boolean) {
        this.currentTensor.momentTensorView.upperHemisphere = checked
        this.fireModifiedTensor()
    }

    toggleMesh(checked: boolean) {
        this.currentTensor.momentTensorView.showMesh = checked
        this.fireModifiedTensor()
    }

    toggleUSGSView() {
        this.usgsViewSubject.next(new USGSView(!this.usgsViewSubject.getValue().isUSGSView))
    }

    toggleUseSDR(checked: boolean) {
        let previousState = this.currentTensor.momentTensorView.useSDR
        this.currentTensor.momentTensorView.useSDR = checked
        if (!previousState && checked) {
            this.updateTensorForSDR()
        } else if (previousState && !checked) {
            this.fireModifiedTensor()
        }
    }

    fireModifiedTensor() {
        this.currentTensor = new MomentTensor(this.currentTensor.momentTensorView, this.currentTensor.cartesian, this.currentTensor.spherical)
        this.polygonizedMomentTensorSubject.next(this.createPolygonizedMomentTensor())
    }

    updateStrike(strike: number) {		
        this.currentTensor.strike = strike		
        this.updateTensorForSDR()		
    }		
    
    updateDip(dip: number) {		
        this.currentTensor.dip = dip		
        this.updateTensorForSDR()		
    }		

    updateRake(rake: number) {		
        this.currentTensor.slip = rake		
        this.updateTensorForSDR()		
    }

    updateTensorForSDR() {		
        let {strike, dip, slip} = this.currentTensor		
        let spherical = beachballs.sdr2mt({ strike, dip, rake: slip })		
        
        this.currentTensor = new MomentTensor(this.currentTensor.momentTensorView, undefined, spherical)		

        // keep original s/d/r, cause after computation they can be slightly different		
        this.currentTensor.strike = strike
        this.currentTensor.dip = dip
        this.currentTensor.slip = slip
        this.polygonizedMomentTensorSubject.next(this.createPolygonizedMomentTensor())		
    }

}
