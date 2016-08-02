import {Component} from '@angular/core'
import * as beachballs from 'seismic-beachballs'

import {MomentTensorService} from '../../services/momenttensor.service'
import {OrbitControls} from './three.orbitcontrols'
import {AbstractSceneComponent} from './abstractscene.component'

let three = require("three");

@Component({
    template: `<div #container style="max-height:500px"></div>`,
    selector: 'fulltensorscene',
})
export class FullTensorSceneComponent extends AbstractSceneComponent {
    controls: any

    constructor(protected momentTensorService: MomentTensorService) {
        super(momentTensorService)
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update()
    }

    afterInit() {
        let hemiLight = new three.HemisphereLight(0xffffff, 0x888888, 1.0);

        this.scene.add(hemiLight);
        this.sceneContainer = this.buildSceneContainer()
        this.scene.add(this.sceneContainer);

        this.controls = new OrbitControls(this.camera, this.container.nativeElement);
        this.controls.addEventListener('change', () => this.render());

        this.camera.position.z = 100;
    }
        
    buildSceneContainer() {
        let container = new three.Object3D()
        this.addBeachball(container)
        this.addFaultPlanes(container)
        this.addPTBAxes(container)
        this.addGrid(container)
        this.addCoordinateArrows(container)
        return container
    }

    private addBeachball(container) {
        let geometry = new three.Geometry()

        let polygons = this.momentTensor.momentTensorView.lowerHemisphere ? beachballs.lowerHemisphereFromMomentTensor(this.momentTensor)
            : beachballs.beachBall(this.momentTensor)

        this.fillGeometry(geometry, polygons)

        geometry.computeFaceNormals()
        geometry.computeVertexNormals()

        var beachballMesh = three.SceneUtils.createMultiMaterialObject(geometry, [
            new three.MeshLambertMaterial({
                vertexColors: three.VertexColors,
                side: three.DoubleSide,
                wireframe: false,
                opacity: 1,
                visible: true
            }),
            new three.MeshBasicMaterial({ color: 0x222222, wireframe: false, visible: false })
        ])

        container.add(beachballMesh)
    }

    private addPTBAxes(container) {
        var sdr = beachballs.mt2sdr(this.momentTensor)

        let axes = [
            { axis: 'paxis', color: '0x0000ff', enabled: this.momentTensor.momentTensorView.pAxis },
            { axis: 'taxis', color: '0x00ff00', enabled: this.momentTensor.momentTensorView.tAxis },
            { axis: 'baxis', color: '0xff0000', enabled: this.momentTensor.momentTensorView.bAxis }
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
        let axes = [
            { color: 0xff0000, direction: new three.Vector3(1, 0, 0) },
            { color: 0x0000ff, direction: new three.Vector3(0, 1, 0) },
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
            opacity: 0.50
        });

        let plane = new three.Mesh(geometry, material)
        plane.lookAt(new three.Vector3(orientation[0], orientation[1], orientation[2]))

        return plane;
    }

    private addFaultPlanes(container) {
        let {normal, slip} = beachballs.normalslip(this.momentTensor)

        var scale = 0.022 * 2200

        let planes = [
            { color: '0xfcbe13', vector: normal, enabled: this.momentTensor.momentTensorView.faultPlane },
            { color: '0x13b2fc', vector: slip, enabled: this.momentTensor.momentTensorView.auxPlane },
        ]

        planes.filter(plane => plane.enabled).forEach(plane => container.add(this.generateFaultPlane(plane.vector, scale, parseInt(plane.color,16))))
    }

    private generateAxis(axis, color) {
        var scale = 0.040 * 2200
        var origin = new three.Vector3(0, 0, 0)
        var arrow = new three.ArrowHelper(new three.Vector3(axis[0], axis[1], axis[2]), origin)
        var axisGeometry = new three.CylinderGeometry(scale * 0.05, scale * 0.05, scale, 10, true)

        var ax = three.SceneUtils.createMultiMaterialObject(axisGeometry, [
            new three.MeshBasicMaterial({
                color: color,
                wireframe: false,
                transparent: true,
                opacity: 0.5
            }),
            new three.MeshBasicMaterial({
                color: 0xaaaaaa,
                wireframe: true,
                transparent: true,
                opacity: 0.5
            })])

        ax.setRotationFromQuaternion(arrow.quaternion)
        ax.position.set(origin.x, origin.y, origin.z)

        return ax
    }

}


