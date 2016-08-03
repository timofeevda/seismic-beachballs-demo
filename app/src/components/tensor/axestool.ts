let three = require("three");

export class AxesTool {
    scene: any
    camera: any
    depth: number = 300
    constructor() {
        this.scene = new three.Scene()

        this.camera = new three.PerspectiveCamera(60, 1, 1, 100000)


        let redColor = 0xff0000
        let greenColor = 0x00ff00
        let blueColor = 0x0000ff
        let centerColor = 0xf3792d

        let parentMesh = new three.Object3D();

        let sphere = new three.Mesh(new three.SphereGeometry(12, 10, 10), new three.MeshLambertMaterial({
            color: centerColor
        }))
        parentMesh.add(sphere)

        // x axis
        this.addLine(parentMesh, new three.Vector3(0, -55, 0), new three.Euler(0, 0, 0), redColor);
        // y axis
        this.addLine(parentMesh, new three.Vector3(55, 0, 0), new three.Euler(0, 0, -Math.PI / 2), blueColor);
        // z axis
        this.addLine(parentMesh, new three.Vector3(0, 0, 55), new three.Euler(Math.PI / 2, 0, 0), greenColor);
        this.addCone(parentMesh, new three.Vector3(110, 0, 0), new three.Euler(0, 0, -Math.PI / 2), blueColor);
        this.addCone(parentMesh, new three.Vector3(0, -110, 0), new three.Euler(0, 0, -Math.PI), redColor);
        this.addCone(parentMesh, new three.Vector3(0, 0, 110), new three.Euler(Math.PI / 2, 0, 0), greenColor);

        this.scene.add(new three.HemisphereLight(0xffffff, 0xAAAAAA, 1.0))

        this.scene.add(parentMesh)
        this.scene.add(this.camera)
    }

    private addLine(container, position, euler, color) {
        let line = new three.Mesh(new three.CylinderGeometry(5, 5, 110, 50, 1), new three.MeshLambertMaterial({
            color: color
        }))
        line.position.set(position.x, position.y, position.z)
        line.setRotationFromEuler(euler)
        container.add(line)
    }

    private addCone(container, position, euler, color) {
        let coneGeometry = new three.CylinderGeometry(0, 12, 40, 50, 1)
        var cone = new three.Mesh(coneGeometry, new three.MeshLambertMaterial({
            color: color
        }))
        cone.geometry = coneGeometry
        cone.position.set(position.x, position.y, position.z)
        cone.setRotationFromEuler(euler)
        container.add(cone)
    }
}