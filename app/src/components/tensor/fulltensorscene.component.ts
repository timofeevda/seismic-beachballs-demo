import {Component} from '@angular/core'

import {MomentTensorService} from '../../services/momenttensor.service'
import {OrbitControls} from './three.orbitcontrols'
import {AbstractSceneComponent} from './abstractscene.component'
import {AxesTool} from './axestool'

import * as three from 'three'
import * as beachballs from 'seismic-beachballs'

@Component({
    template: `<div #container style="max-height:500px"></div>`,
    selector: 'fulltensorscene',
})
export class FullTensorSceneComponent extends AbstractSceneComponent {
    controls: any
    axesTool: AxesTool

    constructor(protected momentTensorService: MomentTensorService) {
        super(momentTensorService)
    }

    animate() {
        requestAnimationFrame(() => this.animate())
        this.controls.update()
    }

    afterInit() {
        let hemiLight = new three.HemisphereLight(0xffffff, 0x888888, 1.0)

        this.axesTool = new AxesTool()

        this.scene.add(hemiLight)
        this.sceneContainer = this.buildSceneContainer()
        this.scene.add(this.sceneContainer)

        this.controls = new OrbitControls(this.camera, this.container.nativeElement, this.axesTool)
        this.controls.addEventListener('change', () => this.render())

        this.camera.position.z = 200
    }

    buildSceneContainer() {
        let container = new three.Object3D()
        this.addBeachball(container)
        this.addFaultPlanes(container)
        this.addPTBAxes(container)
        this.addGrid(container)
        //this.addCoordinateArrows(container)
        return container
    }

    private addBeachball(container) {
        let geometry = new three.Geometry()

        let originalPolygons = this.polygonizedMomentTensor.polygons.map(polygon =>
            ({ vertices: polygon.vertices.map(point => point.map(v => v)), compressional: polygon.compressional }))

        let polygons = this.polygonizedMomentTensor.momentTensor.momentTensorView.lowerHemisphere ?
            beachballs.rawLowerHemisphere(originalPolygons) : originalPolygons

        this.fillGeometry(geometry, polygons)

        geometry.computeFaceNormals()
        geometry.computeVertexNormals()

        let showMesh = this.polygonizedMomentTensor.momentTensor.momentTensorView.showMesh

        var beachballMesh = three.SceneUtils.createMultiMaterialObject(geometry, [
            new three.MeshLambertMaterial({
                vertexColors: three.VertexColors,
                side: three.DoubleSide,
                wireframe: false,
                opacity: 1,
                visible: true
            }),
            new three.MeshBasicMaterial({ color: 0x222222, wireframe: showMesh, visible: showMesh })
        ])

        container.add(beachballMesh)
    }

    private addPTBAxes(container) {
        var sdr = beachballs.mt2sdr(this.polygonizedMomentTensor.momentTensor)

        let axes = [
            { axis: 'paxis', color: '0x00ff00', enabled: this.polygonizedMomentTensor.momentTensor.momentTensorView.pAxis },
            { axis: 'taxis', color: '0xff0000', enabled: this.polygonizedMomentTensor.momentTensor.momentTensorView.tAxis },
            { axis: 'baxis', color: '0x0000ff', enabled: this.polygonizedMomentTensor.momentTensor.momentTensorView.bAxis }
        ]

        axes.filter(axis => axis.enabled).forEach(axis => container.add(this.generateAxis(sdr[axis.axis], parseInt(axis.color, 16))))
    }

    private addGrid(container) {
        let gridHelper = new three.GridHelper(80, 10)
        gridHelper.rotation.x = Math.PI / 2
        gridHelper.position.z = -45
        container.add(gridHelper)
    }

    private addCoordinateArrows(container) {
        // axes in right-handed coordinate system
        let axes = [
            { color: 0xff0000, direction: new three.Vector3(0, -1, 0) }, // x axis
            { color: 0x0000ff, direction: new three.Vector3(1, 0, 0) },  // y axis
            { color: 0x00ff00, direction: new three.Vector3(0, 0, 1) }
        ]

        var origin = new three.Vector3(0, 0, 0)
        var length = 60

        axes.forEach(element => {
            var arrowHelper = new three.ArrowHelper(element.direction, origin, length, element.color)
            container.add(arrowHelper)
        })

    }

    private generateFaultPlane(orientation, size, color) {
        let circleShape = new three.Shape()
        circleShape.absarc(0, 0, size, 0, -Math.PI * 2, true)

        let geometry = circleShape.makeGeometry();
        let material = new three.MeshLambertMaterial({
            color: color,
            vertexColors: three.VertexColors,
            side: three.DoubleSide,
            transparent: true,
            opacity: 0.8
        });

        let plane = new three.Mesh(geometry, material)
        plane.lookAt(new three.Vector3(orientation[0], orientation[1], orientation[2]))

        return plane;
    }

    private addFaultPlanes(container) {
        let {normal, slip} = beachballs.normalslip(this.polygonizedMomentTensor.momentTensor)

        var scale = 0.022 * 2200

        let planes = [
            { color: '0xfcbe13', vector: normal, enabled: this.polygonizedMomentTensor.momentTensor.momentTensorView.faultPlane },
            { color: '0x13b2fc', vector: slip, enabled: this.polygonizedMomentTensor.momentTensor.momentTensorView.auxPlane },
        ]

        planes.filter(plane => plane.enabled).forEach(plane => container.add(this.generateFaultPlane(plane.vector, scale, parseInt(plane.color, 16))))
    }

    private generateAxis(axis, color) {
        var scale = 0.040 * 2200
        var origin = new three.Vector3(0, 0, 0)
        var arrow = new three.ArrowHelper(new three.Vector3(axis[0], axis[1], axis[2]), origin)
        var axisGeometry = new three.CylinderGeometry(scale * 0.05, scale * 0.05, scale, 10)

        var ax = three.SceneUtils.createMultiMaterialObject(axisGeometry, [
            new three.MeshBasicMaterial({
                color: color,
                wireframe: false,
                transparent: true,
                opacity: 0.8
            }),
            new three.MeshBasicMaterial({
                color: 0xaaaaaa,
                wireframe: true,
                transparent: true,
                opacity: 0.8
            })])

        ax.setRotationFromQuaternion(arrow.quaternion)
        ax.position.set(origin.x, origin.y, origin.z)

        return ax
    }

    render() {
        this.renderer.setScissorTest(false)
        this.renderer.setClearColor("#e6e6e6", 1)
        super.render.call(this)
        this.renderer.setViewport(0, 0, 120, 120)
        this.renderer.setScissor(0, 0, 120, 120)
        this.renderer.setScissorTest(true)
        this.renderer.setClearColor("#e6e6e6", 1)
        this.renderer.render(this.axesTool.scene, this.axesTool.camera)
        var height = this.container.nativeElement.clientHeight
        var width = this.container.nativeElement.clientWidth
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
    }

}


