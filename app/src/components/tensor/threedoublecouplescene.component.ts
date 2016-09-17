import {Component} from '@angular/core'

import * as beachballs from 'seismic-beachballs'
import * as three from 'three'

import {MomentTensorService} from '../../services/momenttensor.service'
import {AbstractSceneComponent} from './abstractscene.component'

/**
 * 3D (Three.js) double couple scene replacing deprecated DoubleCoupleSceneComponent
 */
@Component({
    template: `<div #container [style.height]="height"></div>`,
    selector: 'threedoublecouplescene',
    inputs: ['height']
})
export class ThreeDoubleCoupleSceneComponent extends AbstractSceneComponent {
    height: string

    constructor(protected momentTensorService: MomentTensorService) {
        super(momentTensorService)
    }

    animate() {
        this.render()
    }

    afterInit() {
        this.sceneContainer = this.buildSceneContainer()
        this.scene.add(this.sceneContainer)
        this.camera.position.z = 130
    }

    buildSceneContainer() {
        let container = new three.Object3D()

        let geometry = new three.Geometry()

        let momenttensor = this.polygonizedMomentTensor.momentTensor
        
        // moment tensor representing only double couple
        let sphericalTensor = beachballs.sdr2mt({ strike: momenttensor.strike, dip: momenttensor.dip, rake: momenttensor.slip })
        
        let doubleCouple = {
            Mrr: sphericalTensor.Mrr,
            Mtt: sphericalTensor.Mtt,
            Mpp: sphericalTensor.Mpp,
            Mrt: sphericalTensor.Mrt,
            Mrp: sphericalTensor.Mrp,
            Mtp: sphericalTensor.Mtp,
            strike: momenttensor.strike,
            dip: momenttensor.dip,
            slip: momenttensor.slip
        }

        let polygons = beachballs.lowerHemisphereEqualAreaNet(doubleCouple).map(polygon =>
            ({ vertices: polygon.vertices.map(point => point.map(v => v)), compressional: polygon.compressional }))

        this.fillGeometry(geometry, polygons)

        geometry.computeFaceNormals()
        geometry.computeVertexNormals()

        let mesh = new three.Mesh(geometry, new three.MeshBasicMaterial({
            vertexColors: three.VertexColors,
            side: three.DoubleSide,
            wireframe: false,
            opacity: 1,
            visible: true
        }))
        container.add(mesh)

        return container
    }

}


