import * as three from 'three'

export class AxesTool {
    scene: three.Scene
    camera: three.PerspectiveCamera
    depth: number = 300
    colorScheme = {
        center: 0xf3792d,
        south: 0xf3792d,
        east: 0xf3792d,
        up: 0xf3792d
    }
    constructor() {
        this.scene = new three.Scene()
        this.camera = new three.PerspectiveCamera(60, 1, 1, 100000)

        let container = new three.Object3D()        
        container.add.apply(container, this.createOrigin())
        container.add.apply(container, this.createAxesCones())
        container.add.apply(container, this.createAxesLines())
        container.add.apply(container, this.createAxesLabels())

        this.scene.add(container)                
        this.scene.add(this.camera)
        this.scene.add(new three.HemisphereLight(0xffffff, 0xAAAAAA, 1.0))
    }

    private createOrigin(): three.Mesh[] {
        return [new three.Mesh(new three.SphereGeometry(12, 10, 10), new three.MeshLambertMaterial({
            color: this.colorScheme.center
        }))]
    }

    private createAxesLabels(): three.Sprite[] {
        let labels = [
            { text: 'E', position: new three.Vector3(125, 0, 0) },
            { text: 'S', position: new three.Vector3(0, -125, 0) },
            { text: 'UP', position: new three.Vector3(0, 0, 125) }
        ]

        return labels.map(label => this.createAxisLabel(label.text, label.position))
    }

    private createAxesCones(): three.Mesh[] {
        let axesCones = [            
            {position: new three.Vector3(0, -110, 0), euler: new three.Euler(0, 0, -Math.PI), color: this.colorScheme.south },            
            {position: new three.Vector3(110, 0, 0), euler: new three.Euler(0, 0, -Math.PI / 2), color: this.colorScheme.east },            
            {position: new three.Vector3(0, 0, 110), euler: new three.Euler(Math.PI / 2, 0, 0), color: this.colorScheme.up }
        ]

        return axesCones.map(cone => this.createCone(cone.position, cone.euler, cone.color))
    }

    private createAxesLines(): three.Mesh[] {
        let axesLines = [
            {position: new three.Vector3(0, -55, 0), euler: new three.Euler(0, 0, 0), color: this.colorScheme.south },
            {position: new three.Vector3(55, 0, 0), euler: new three.Euler(0, 0, -Math.PI / 2), color: this.colorScheme.east},
            {position: new three.Vector3(0, 0, 55), euler: new three.Euler(Math.PI / 2, 0, 0), color: this.colorScheme.up}
        ]

        return axesLines.map(line => this.createLine(line.position, line.euler, line.color))
    }

    private createLine(position, euler, color): three.Mesh {
        let line = new three.Mesh(new three.CylinderGeometry(5, 5, 110, 50, 1), new three.MeshLambertMaterial({
            color: color
        }))
        line.position.set(position.x, position.y, position.z)
        line.setRotationFromEuler(euler)
        return line
    }

    private createCone(position, euler, color): three.Mesh {
        let coneGeometry = new three.CylinderGeometry(0, 12, 40, 50, 1)
        var cone = new three.Mesh(coneGeometry, new three.MeshLambertMaterial({
            color: color
        }))
        cone.geometry = coneGeometry
        cone.position.set(position.x, position.y, position.z)
        cone.setRotationFromEuler(euler)
        return cone
    }

    private createAxisLabel(label, position): three.Sprite {
        let canvas = document.createElement('canvas')
        canvas.height = 256
        canvas.width = 256
        let gc = canvas.getContext('2d')
        gc.font = "Bold 80px Arial"
        gc.fillStyle = "#000000"
        gc.textAlign = 'center'
        gc.fillText(label, 128, 128)

        let texture = new three.Texture(canvas)
        texture.needsUpdate = true

        let spriteMaterial = new three.SpriteMaterial({ map: texture })

        var sprite = new three.Sprite(spriteMaterial)
        sprite.position.set(position.x, position.y, position.z)
        sprite.scale.set(100, 100, 1)
        return sprite;
    }
}
