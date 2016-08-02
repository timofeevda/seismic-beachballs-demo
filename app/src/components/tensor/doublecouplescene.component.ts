import {Component, ElementRef, ViewChild, Input} from '@angular/core'

import * as beachballs from 'seismic-beachballs'

import {MomentTensor} from '../../model/momenttensor.model'
import {MomentTensorService, PolygonizedMomentTensor} from '../../services/momenttensor.service'

@Component({
    template: `
    <div #container [style.height]="height" align="center" style="background-color: e6e6e6;">
        <canvas #canvas></canvas>
    </div>`,
    selector: 'doublecouplescene'
})
export class DoubleCoupleSceneComponent {    
    @ViewChild('container') container: ElementRef
    @ViewChild('canvas') canvas: ElementRef
    @Input() height: string
    polygonizedMomentTensor: PolygonizedMomentTensor

    constructor(private momentTensorService: MomentTensorService) {
        this.momentTensorService.polygonizedMomentTensorSubject.subscribe(pmt => {
            this.polygonizedMomentTensor = pmt
            if (this.canvas) {
                this.drawTensor()
            }
        })
    }

    private drawTensor() {
        var graphicContext = this.canvas.nativeElement.getContext('2d');
        graphicContext.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

        if (this.polygonizedMomentTensor.momentTensor.sdrComputationError) {
            return;
        }

        // preserve aspect ratio
        this.canvas.nativeElement.width = this.container.nativeElement.clientHeight
        this.canvas.nativeElement.height = this.container.nativeElement.clientHeight

        const width = this.canvas.nativeElement.width / 2
        const height = this.canvas.nativeElement.height / 2

        let {strike, dip, rake} = beachballs.mt2sdr(this.polygonizedMomentTensor.momentTensor)

        let {comp, dilat} = beachballs.doublecouple(strike, dip, rake)

        // draw compressive and dilatational segments
        this.drawSegment(comp.elements, '#ff0000', width, height, graphicContext)
        this.drawSegment(dilat.elements, '#fff', width, height, graphicContext)
    }

    private drawSegment(points: number[][], color: string, width: number, height: number, graphicContext) {
        graphicContext.beginPath();
        graphicContext.moveTo(points[0][0] * width + width, points[0][1] * -(height - 2) + height + 2)
        points.forEach(point => graphicContext.lineTo(point[0] * width + width - 2, point[1] * -(height) + height + 2))
        graphicContext.closePath()
        graphicContext.fillStyle = color
        graphicContext.fill()
    }

    ngAfterViewInit() {
        window.addEventListener('resize', () => { this.onWindowResize() }, false);
        this.drawTensor()
    }

    private onWindowResize() {
        this.drawTensor()
    }

}


