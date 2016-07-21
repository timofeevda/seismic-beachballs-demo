import { Injectable } from '@angular/core'
import {Subject, BehaviorSubject} from 'RxJs'
import * as beachballs from "seismic-beachballs"

import {MomentTensor, MomentTensorView} from '../model/momenttensor.model'

@Injectable()
export class MomentTensorService {
    momentTensorSubject: Subject<MomentTensor>
    currentTensor: MomentTensor

    constructor() {
        let cartesianTensor = { Mxx: -0.1977, Mxy: 0.1431, Mxz: -0.9390, Myy: 0.2505, Myz: -0.6885, Mzz: -0.1073 }
        let momentTensorView: MomentTensorView = {pAxis: true, tAxis: true, bAxis: true, faultPlane: true, auxPlane: true, lowerHemisphere: true}
        this.currentTensor = new MomentTensor(momentTensorView, cartesianTensor, undefined)
        this.momentTensorSubject = new BehaviorSubject<MomentTensor>(this.currentTensor)
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

    updateSDRForTensor() {
        this.currentTensor = new MomentTensor(this.currentTensor.momentTensorView,undefined, {
            Mpp: this.currentTensor.Mpp, Mrp: this.currentTensor.Mrp, Mrr: this.currentTensor.Mrr,
            Mrt: this.currentTensor.Mrt, Mtp: this.currentTensor.Mtp, Mtt: this.currentTensor.Mtt
        })
        this.momentTensorSubject.next(this.currentTensor)
    }

    updateTensorForSDR() {
        let {strike, dip, slip} = this.currentTensor
        let spherical = beachballs.sdr2mt({ strike, dip, rake: slip })

        this.currentTensor = new MomentTensor(this.currentTensor.momentTensorView,undefined, spherical)

        // keep original s/d/r, cause after computation they can be slightly different
        this.currentTensor.strike = strike
        this.currentTensor.dip = dip
        this.currentTensor.slip = slip

        this.momentTensorSubject.next(this.currentTensor)
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
        this.momentTensorSubject.next(this.currentTensor)
    }
}
