import {ElementRef, ViewChild} from '@angular/core'

import {MomentTensor} from '../../model/momenttensor.model'
import {MomentTensorService, PolygonizedMomentTensor} from '../../services/momenttensor.service'

import * as _ from 'lodash'

let three = require("three");

export abstract class AbstractSceneComponent {
    @ViewChild('container') container: ElementRef
    polygonizedMomentTensor: PolygonizedMomentTensor
    camera: any
    scene: any
    renderer: any
    sceneContainer: any

    constructor(protected momentTensorService: MomentTensorService) {
        this.momentTensorService.polygonizedMomentTensorSubject.subscribe(pmt => {
            this.polygonizedMomentTensor = pmt
            if (this.scene) {
                this.updateTensorView()
            }
        })
    }

    abstract animate()
    abstract afterInit()
    abstract buildSceneContainer()

    ngAfterViewInit() {
        this.init()
        this.onWindowResize()
        this.animate()
    }

    init() {
        const width = this.container.nativeElement.clientWidth
        const height = this.container.nativeElement.clientHeight

        this.camera = new three.PerspectiveCamera(35, width / height, 1, 10000)

        this.scene = new three.Scene()

        this.renderer = new three.WebGLRenderer({ antialias: true , alpha: true })
        this.renderer.setClearColor("#e6e6e6", 1)
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        this.container.nativeElement.appendChild(this.renderer.domElement)

        window.addEventListener('resize', () => { this.onWindowResize() }, false)

        this.afterInit()
    }

    updateTensorView() {
        this.scene.remove(this.sceneContainer)
        if (!this.polygonizedMomentTensor.momentTensor.sdrComputationError) {
            this.sceneContainer = this.buildSceneContainer()
            this.scene.add(this.sceneContainer)
        }
        this.render()
    }

    onWindowResize() {
        const height = this.container.nativeElement.clientHeight
        const width = this.container.nativeElement.clientWidth
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
        this.render()
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    fillGeometry(geometry, polygons) {
        var index = 0
        polygons.forEach(polygon => {

            polygon.vertices.forEach(vertex => {
                var threePoint = new three.Vector3(vertex[0], vertex[1], vertex[2])
                threePoint.multiplyScalar(40)
                geometry.vertices.push(threePoint)
            });

            var face1 = new three.Face3(index, index + 1, index + 3)
            var face2 = new three.Face3(index + 1, index + 2, index + 3)

            face1.color = polygon.compressional ? new three.Color(0xff0000) : new three.Color(0xffffff)

            face2.color = face1.color

            geometry.faces.push(face1)
            geometry.faces.push(face2)

            index += 4
        })
    }
}