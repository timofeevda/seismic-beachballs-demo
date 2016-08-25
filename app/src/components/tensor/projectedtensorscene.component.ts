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
        this.camera.position.z = 130
    }
    
    buildSceneContainer() {
        let container = new three.Object3D()

        let geometry = new three.Geometry()

        let originalPolygons = this.polygonizedMomentTensor.polygons.map(polygon => 
            ({vertices: polygon.vertices.map(point => point.map(v => v)), compressional: polygon.compressional}))
                
        let polygons = []
        switch (this.projection) {
            case "equalarea":
            polygons = beachballs.rawLowerHemisphereEqualAreaNet(originalPolygons)
                break;
            case "wulff":
                polygons = beachballs.rawLowerHemisphereWulffNet(originalPolygons)
                break;
            case "orthographic":
                polygons = beachballs.rawLowerHemisphereOrthographic(originalPolygons)
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


