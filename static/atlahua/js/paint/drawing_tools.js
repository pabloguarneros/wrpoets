import {getCurvePoints} from "../helpers/calculateCurve.js";

class Paint {
    constructor() {
        this.material = new THREE.MeshLambertMaterial(
            {   color: 0x171717,
                emissive: 0x00000
            } );
        //this.geometry = new THREE.SphereGeometry( 1.6, 8, 16 );
        //this.geometry = new THREE.IcosahedronGeometry( 1.7);
        this.geometry = new THREE.TorusKnotGeometry( 2, 3, 100, 16 );
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

    normalizeVideoFeed(indexFingerTipPosition){
        const x = (indexFingerTipPosition[0]/this.canvas.video.videoWidth) + .8;
        const y = (1 - (indexFingerTipPosition[1]/this.canvas.video.videoHeight)-0.3);
        return {x,y}
    }

    augment(x_normal,y_normal){
        var x = this.canvas.resize_scale*(2*x_normal-1);
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
            x_pos, y_pos, this.canvas.controls.camera.position.z-94]
            );
        var animationClip = new THREE.AnimationClip(null, 1, [track]);
        var animationAction = sphere.userData.mixer.clipAction(animationClip);
        
        animationAction.setLoop(THREE.LoopOnce);
        animationAction.clampWhenFinished = true;
        animationAction.play();

        sphere.position.set(x_pos,y_pos,this.canvas.controls.camera.position.z-101);

      };

    generateStroke(indexFingerTipPosition){
        const normals = this.normalizeVideoFeed(indexFingerTipPosition);
        const positions = this.augment(normals.x, normals.y);
        var pointsToPlot = [];
        if (this.canvas.currentCursor == [0,0]){
            pointsToPlot = [positions.x, positions.y];
        } else {
            pointsToPlot = getCurvePoints(this.canvas.currentCursor.concat([positions.x, positions.y]),this.canvas.threejsDiagonal);
        }
        this.canvas.currentCursor = [positions.x, positions.y];
        for (var pts_pair = 0; pts_pair < pointsToPlot.length; pts_pair += 2){
            const bones = [];
            const x = pointsToPlot[pts_pair]
            const y = pointsToPlot[pts_pair+1]

            for (let i = 0; i < 9; i ++){
                //const sphere = new THREE.Mesh( this.paint.geometry, this.paint.material );
                const newBone = new THREE.Bone();
                bones.push(newBone);
                newBone.position.set(Math.random()*6-3,
                                    Math.random()*6-3,
                                    Math.random()*2-1);
                newBone.rotation.x = -2*i;
                if (bones.length > 1){
                    bones[i-1].add(newBone)
                }
                
            }
            const mesh = new THREE.SkinnedMesh( this.paint.geometry, this.paint.material );
            const skeleton = new THREE.Skeleton( bones );
            mesh.add(skeleton.bones[ 0 ]);
            mesh.bind(skeleton);
            mesh.position.set(x,y,this.canvas.controls.camera.position.z-95)
            this.canvas.scene.add(mesh);
            //this.animate(sphere, x, y);
        }
    }

};

export {Stroke};