import * as beachballs from "seismic-beachballs"

class MomentTensorView {
    pAxis: boolean
    tAxis: boolean
    bAxis: boolean
    faultPlane: boolean
    auxPlane: boolean
    horPlane: boolean
    lowerHemisphere: boolean
    showMesh: boolean
}

class MomentTensor implements beachballs.CartesianMomentTensor, beachballs.SphericalMomentTensor {
    Mzz: number
    Mxx: number
    Myy: number
    Mxz: number
    Myz: number
    Mxy: number

    Mrr: number
    Mtt: number
    Mpp: number
    Mrt: number
    Mrp: number
    Mtp: number

    strike: number
    dip: number
    slip: number

    sdrComputationError: boolean

    constructor(public momentTensorView: MomentTensorView,
        public cartesian?: beachballs.CartesianMomentTensor,
        public spherical?: beachballs.SphericalMomentTensor) {
        this.updateProperties(cartesian, spherical)

        try {
            let {strike, dip, rake, strike_swap, dip_swap, rake_swap} = beachballs.mt2sdr(this.spherical)
            if (rake < -90 || rake > 90) {
                this.strike = strike_swap
                this.slip = rake_swap
                this.dip = dip_swap
            } else {
                this.strike = strike
                this.slip = rake
                this.dip = dip
            }                        
        } catch (e) {
            console.log("Strike/Dip/Rake computation error due to error in getting eigenvalues from tensor matrix. Please, check tensor parameters for correctness.", e);
            this.sdrComputationError = true
        }

    }

    updateProperties(cartesian?: beachballs.CartesianMomentTensor, spherical?: beachballs.SphericalMomentTensor) {
        this.cartesian = cartesian
        this.spherical = spherical
        if (this.cartesian && !this.spherical) {
            this.spherical = beachballs.mtcart2sph(this.cartesian)
        } else if (this.spherical && !this.cartesian) {
            this.cartesian = beachballs.mtsph2cart(this.spherical)
        }
        for (let prop in this.cartesian) {
            this[prop] = this.cartesian[prop]
        }
        for (let prop in this.spherical) {
            this[prop] = this.spherical[prop]
        }
    }

}

export {MomentTensor, MomentTensorView}