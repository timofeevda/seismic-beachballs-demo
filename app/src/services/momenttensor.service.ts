import { Injectable } from '@angular/core'
import {Subject, BehaviorSubject} from 'RxJs'
import * as beachballs from "seismic-beachballs"

import {MomentTensor, MomentTensorView} from '../model/momenttensor.model'

export class PolygonizedMomentTensor {
    constructor(public momentTensor: MomentTensor, public polygons: { vertices: number[][], compressional: boolean }[]){}
}

@Injectable()
export class MomentTensorService {
    polygonizedMomentTensorSubject: Subject<PolygonizedMomentTensor>
    currentTensor: MomentTensor

    constructor() {
        let cartesianTensor = { Mxx: 99, Mxy: 0, Mxz: 0, Myy: 1, Myz: 0, Mzz: -10 }
        let momentTensorView: MomentTensorView = {pAxis: true, tAxis: true, bAxis: true, faultPlane: true, auxPlane: true, lowerHemisphere: false}
        this.currentTensor = new MomentTensor(momentTensorView, cartesianTensor, undefined)
        this.polygonizedMomentTensorSubject = new BehaviorSubject<PolygonizedMomentTensor>(this.createPolygonizedMomentTensor())
    }

    private createPolygonizedMomentTensor(): PolygonizedMomentTensor {
        return new PolygonizedMomentTensor(this.currentTensor, this.currentTensor.sdrComputationError ? [] : beachballs.beachBall(this.currentTensor))
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
        this.currentTensor = new MomentTensor(this.currentTensor.momentTensorView,undefined, {
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

    toggleLowerHemisphere() {
        this.currentTensor.momentTensorView.lowerHemisphere = !this.currentTensor.momentTensorView.lowerHemisphere
        this.fireModifiedTensor()
    }

    fireModifiedTensor() {
        this.currentTensor = new MomentTensor(this.currentTensor.momentTensorView, this.currentTensor.cartesian, this.currentTensor.spherical)
        this.polygonizedMomentTensorSubject.next(this.createPolygonizedMomentTensor())       
    }
}
