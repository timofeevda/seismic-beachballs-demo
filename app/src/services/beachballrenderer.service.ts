import { Injectable } from '@angular/core'

import * as beachballs from 'seismic-beachballs'

import {USGSEvent} from '../model/usgsevent.model'

@Injectable()
export class BeachBallCanvasRendererService {
    canvasesCache = {}
    errorCanvas: HTMLCanvasElement
    constructor() {
        this.errorCanvas = this.createErrorCanvas()
    }
    renderBeachBall(usgsEvent: USGSEvent) {
        let cachedImage = this.canvasesCache[usgsEvent.id]

        if (cachedImage) {
            return cachedImage
        }

        let scalar = usgsEvent.Mscalar
        let sphMT = {
            Mrr: usgsEvent.Mrr / scalar,
            Mtt: usgsEvent.Mtt / scalar,
            Mpp: usgsEvent.Mpp / scalar,
            Mrt: usgsEvent.Mrt / scalar,
            Mrp: usgsEvent.Mrp / scalar,
            Mtp: usgsEvent.Mtp / scalar,
            strike: 0,
            dip: 0,
            slip: 0
        }


        let canvas
        try {
            let {strike, dip, rake} = beachballs.mt2sdr(sphMT)

            sphMT.strike = strike
            sphMT.dip = dip
            sphMT.slip = rake
            canvas = this.createCanvas(beachballs.lowerHemisphereEqualAreaNet(sphMT, 20, 15))
        } catch (error) {
            usgsEvent.error = '' + error
            canvas = this.errorCanvas
        }

        this.canvasesCache[usgsEvent.id] = this.scale(canvas, 8)

        return this.canvasesCache[usgsEvent.id]
    }

    private createErrorCanvas() {
        let canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256
        let gc = canvas.getContext('2d')

        let image = new Image()
        image.onload = () => gc.drawImage(image, 0, 0, image.width, image.height, 0, 0, 256, 256)
        image.src = "app/resources/error.png"

        return canvas
    }

    private createCanvas(beachball: { vertices: number[][], compressional: boolean }[]) {
        let canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256

        let gc = canvas.getContext('2d')

        gc.fillStyle = "#ff0000"
        beachball.forEach(function (polygon) {
            gc.beginPath()
            gc.moveTo(polygon.vertices[0][0] * 126 + 126, polygon.vertices[0][1] * -126 + 126)
            gc.fillStyle = polygon.compressional ? "#ff0000" : 'white'
            polygon.vertices.forEach(vertex => gc.lineTo(vertex[0] * 126 + 126, vertex[1] * -126 + 126))
            gc.closePath()
            gc.fill()
            gc.strokeStyle = polygon.compressional ? "#ff0000" : 'white'
            gc.stroke()
        });
        gc.beginPath()
        gc.arc(126, 126, 122, 0, 2 * Math.PI, true)
        gc.closePath()
        gc.strokeStyle = 'grey'
        gc.lineWidth = 8
        gc.stroke()

        return canvas
    }

    private scale(canvas: HTMLCanvasElement, factor: number): HTMLCanvasElement {
        let scaledCanvas = document.createElement('canvas')
        scaledCanvas.width = canvas.width / factor
        scaledCanvas.height = canvas.height / factor
        let gc = scaledCanvas.getContext('2d')
        gc.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width / factor, canvas.height / factor)
        return scaledCanvas
    }
}