import {getCurvePoints} from "./helpers/calculateCurve.js";

class Paint {
    constructor() {
        this.material = new THREE.MeshBasicMaterial( { color: 0xffffff} );
        this.geometry = new THREE.SphereGeometry( 1.6, 8, 16 );
    } 
}

class Stroke {
    constructor(canvas) {
        this.canvas = canvas;
        this.paint = new Paint();
        
        this.normalizeVideoFeed = this.normalizeVideoFeed.bind(this);
        this.augment = this.augment.bind(this);
        this.animate = this.animate.bind(this);
        this.generateStroke = this.generateStroke.bind(this);
        
    }

    normalizeVideoFeed(boundingBox){
        const x = (boundingBox.topLeft[0]/this.canvas.video.videoWidth) + .8;
        const y = (1 - (boundingBox.topLeft[1]/this.canvas.video.videoHeight)-0.3);
        return {x,y}
    }

    augment(x_normal,y_normal){
        var x = x_normal*(this.canvas.resize_scale*2)-this.canvas.resize_scale;
        var y = 115*y_normal-55;
        return {x, y}
    }

    animate(sphere, x_pos, y_pos){
        
        sphere.userData.mixer = new THREE.AnimationMixer(sphere);
        sphere.userData.clock = new THREE.Clock();

        this.canvas.animationObjects.push(sphere);
 
        
        var track = new THREE.VectorKeyframeTrack(
            '.position',
            [0, 1],
            [x_pos, y_pos, this.canvas.controls.camera.position.z-95, //start position
            x_pos, y_pos, this.canvas.controls.camera.position.z-94] //endposition
            );
        var animationClip = new THREE.AnimationClip(null, 1, [track]);
        var animationAction = sphere.userData.mixer.clipAction(animationClip);
        
        animationAction.setLoop(THREE.LoopOnce);
        animationAction.clampWhenFinished = true;
        animationAction.play();

        sphere.position.set(x_pos,y_pos,this.canvas.controls.camera.position.z-101);

      };

    generateStroke(boundingBox){
        const normals = this.normalizeVideoFeed(boundingBox);
        const positions = this.augment(normals.x, normals.y);
        var pointsToPlot = [];
        if (this.canvas.currentCursor == [0,0]){
            pointsToPlot = [positions.x, positions.y];
        } else {
            pointsToPlot = getCurvePoints(this.canvas.currentCursor.concat([positions.x, positions.y]),this.canvas.threejsDiagonal);
        }
        this.canvas.currentCursor = [positions.x, positions.y];
        for (var pts_pair = 0; pts_pair < pointsToPlot.length; pts_pair += 2){
            const x = pointsToPlot[pts_pair]
            const y = pointsToPlot[pts_pair+1]
            const sphere = new THREE.Mesh( this.paint.geometry, this.paint.material );
            this.canvas.scene.add(sphere);
            this.animate(sphere, x, y);
        }
    }

};

export {Stroke};