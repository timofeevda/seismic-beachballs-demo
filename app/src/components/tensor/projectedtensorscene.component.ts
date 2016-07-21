import {Component} from '@angular/core'

import * as beachballs from 'seismic-beachballs'

import {MomentTensorService} from '../../services/momenttensor.service'
import {AbstractSceneComponent} from './abstractscene.component'

declare var require: any
let three = require("three");

@Component({
    template: `<div #container [style.height]="height"></div>`,
    selector: 'projectedtensorscene',
    inputs: ['height', 'projection']
})
export class ProjectedTensorSceneComponent extends AbstractSceneComponent {
    height: string
    projection: string

    constructor(protected momentTensorService: MomentTensorService) {
        super(momentTensorService)
    }

    animate() {
        this.render()
    }

    afterInit() {
        this.sceneContainer = this.buildSceneContainer()
        this.scene.add(this.sceneContainer)
        this.camera.position.z = 70
    }
    
    buildSceneContainer() {
        let container = new three.Object3D()

        let geometry = new three.Geometry()
                
        let polygons = []
        switch (this.projection) {
            case "equalarea":
            polygons = beachballs.lowerHemisphereEqualAreaNet(this.momentTensor)
                break;
            case "wulff":
                polygons = beachballs.lowerHemisphereWulffNet(this.momentTensor)
                break;
            case "orthographic":
                polygons = beachballs.lowerHemisphereOrthographic(this.momentTensor)
                break;
            default:
                polygons = []
        }

        this.fillGeometry(geometry, polygons)

        geometry.computeFaceNormals()
        geometry.computeVertexNormals()

        var mesh = new three.Mesh(geometry, new three.MeshBasicMaterial({
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


