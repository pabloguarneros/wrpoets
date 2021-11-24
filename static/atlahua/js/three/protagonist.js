import $ from 'jquery';
import { GLTFLoader } from 'three/examples/js/loaders/GLTFLoader.js';
import {FBXLoader} from "three/examples/js/loaders/FBXLoader.js";

import {character_has_loaded} from "./access_btn.js";

class BasicCharacterControllerProxy {
    constructor(animations) {
        this._animations = animations;
    }

    get animations(){
        return this._animations;
    }
};

class BasicCharacterController{
    
    constructor(params) {
        this._Init(params)
    }

    _Init(params){
        this._params = params;
        this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
        this._acceleration = new THREE.Vector3(0.8, 0.1, 30.0);
        this._velocity = new THREE.Vector3(0, 0, 0);
        this._target = null;

        this._animations = {};
        this._input = new BasicCharacterControllerInput();
        this._stateMachine = new CharacterFSM(
            new BasicCharacterControllerProxy(this._animations));

        this._LoadModels();
        
    }


    _LoadModels(){


      let character_texture = new THREE.TextureLoader().load('static/models/characters/ghost/textures/Material_baseColor.png');

      character_texture.flipY = false; // we flip the texture so that its the right way up

        const character_mtl = new THREE.MeshPhongMaterial({
          map: character_texture,
          color: 0xffffff,
          skinning: true
        });

        const basic_controller = this;
        const MODEL_PATH = 'static/models/characters/ghost/scene.gltf'; 

        const loading_manager = new THREE.LoadingManager();
        loading_manager.onProgress = function( url, itemsLoaded, itemsTotal ){
          $("#loading_bar").css("width",`${10+(itemsLoaded / itemsTotal * 90)}%`);
          $("#percentage").html(`${10+(itemsLoaded / itemsTotal * 90)}%`)
        }
        loading_manager.onLoad = () => {
            basic_controller._stateMachine.SetState('Armature.001|Sad.Idle.001');
            character_has_loaded();
        };

        var loader = new THREE.GLTFLoader(loading_manager);

        

        loader.load(
          MODEL_PATH,
          function ( gltf ) {
            let model = gltf.scene;
            const fileAnimations = gltf.animations;

            basic_controller._target = model;
            basic_controller._params.scene.add( model );

            model.traverse(o => {
              if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
                o.material = character_mtl;
              }
            });

            
            model.scale.set(5, 5, 5);



            basic_controller._mixer = new THREE.AnimationMixer( model );
           
            const activateAnimation = (animName, clip) => {
                const action = basic_controller._mixer.clipAction(clip);
                basic_controller._animations[animName] = {
                    clip: clip,
                    action: action,
                };
            };
            
            for (var i = 0; i < fileAnimations.length; i ++){
              activateAnimation(fileAnimations[i].name,fileAnimations[i])
            }

      
            
          },
           undefined,
           function(error){
             console.error(error);
           }
          );
    }

    Update(timeInSeconds){
        if (!this._target){
            return;
        }

        this._stateMachine.Update(timeInSeconds, this._input);
        const velocity = this._velocity;
        const frameDecceleration = new THREE.Vector3(
            velocity.x * this._decceleration.x,
            velocity.y * this._decceleration.y,
            velocity.z * this._decceleration.z
        )

        frameDecceleration.multiplyScalar(timeInSeconds);
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
            Math.abs(frameDecceleration.z), Math.abs(velocity.z));

        velocity.add(frameDecceleration);

        const controlObject = this._target;
        const _Q = new THREE.Quaternion();
        const _A = new THREE.Vector3();
        const _R = controlObject.quaternion.clone();

        const acc = this._acceleration.clone();
        if (this._input._keys.shift) {
            acc.multiplyScalar(2.0);
        }

        if (this._input._keys.forward) {
            velocity.z += acc.z * timeInSeconds;
          }
        
        if (this._input._keys.backward) {
            velocity.z -= acc.z * timeInSeconds;
          }
        
        if (this._input._keys.left) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
          }
        
        if (this._input._keys.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
          }
      
          controlObject.quaternion.copy(_R);
      
          const oldPosition = new THREE.Vector3();
          oldPosition.copy(controlObject.position);
      
          const forward = new THREE.Vector3(0, 0, 1);
          forward.applyQuaternion(controlObject.quaternion);
          forward.normalize();
      
          const sideways = new THREE.Vector3(1, 0, 0);
          sideways.applyQuaternion(controlObject.quaternion);
          sideways.normalize();
      
          sideways.multiplyScalar(velocity.x * timeInSeconds);
          forward.multiplyScalar(velocity.z * timeInSeconds);
      
          controlObject.position.add(forward);
          controlObject.position.add(sideways);
      
          oldPosition.copy(controlObject.position);

          if (this._mixer) {
            this._mixer.update(timeInSeconds);
          }


    }

};

class BasicCharacterControllerInput{
    constructor() {
        this._Init();
    }

    _Init(){
        this._keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,            
        };
        document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
    }

    _onKeyDown(event){
        switch (event.keyCode){

            case 65: //a
                this._keys.left = true;
                break;
            case 37: // left arrow
                this._keys.left = true;
                break;

            case 68: //d
                this._keys.right = true;
                break;
            case 39: // right arrow
                this._keys.right = true;
                break;

            case 87: //w
                this._keys.forward = true;
                break;
            case 38: //up arrow
                this._keys.forward = true;
                break;

        }
    }

    _onKeyUp(event){
        switch (event.keyCode){

            case 65: //a
                this._keys.left = false;
                break;
            case 37: // left arrow
                this._keys.left = false;
                break;

            case 68: //d
                this._keys.right = false;
                break;
            case 39: // right arrow
                this._keys.right = false;
                break;

            case 87: //w
                this._keys.forward = false;
                break;
            case 38: //up arrow
                this._keys.forward = false;
                break;

            case 83: //s
                this._keys.backward = false;
                break;
            case 40: // down arrow
                this._keys.backward = false;
                break;
        }
    }
};

class FiniteStateMachine {
    constructor (){
        this._states = {};
        this._currentState = null;
    }

    _AddState(name, type){
        this._states[name] = type;
    }

    SetState(name){
        const prevState = this._currentState;

        if (prevState){
            if (prevState.Name == name){
                return;
            }
            prevState.Exit();
        }
    
        const state = new this._states[name](this);

        this._currentState = state;
        state.Enter(prevState);
    }

    Update(timeElapsed, input) {
        if (this._currentState) {
            this._currentState.Update(timeElapsed, input);
        }
    }
};

class CharacterFSM extends FiniteStateMachine {
    constructor(proxy) {
      super();
      this._proxy = proxy;
      this._Init();
    }
  
    _Init() {
      this._AddState('Armature.001|Sad.Idle.001', IdleState);
      this._AddState('Armature.001|Armature.002|mixamo.com|Layer0', WalkState);
    }
  };
  
  
  class State {
    constructor(parent) {
      this._parent = parent;
    }
  
    Enter() {}
    Exit() {}
    Update() {}
  };

class WalkState extends State {
    constructor(parent) {
      super(parent);
    }

    get Name() {
      return 'Armature.001|Armature.002|mixamo.com|Layer0';
    }

    Enter(prevState) {
      const curAction = this._parent._proxy._animations['Armature.001|Armature.002|mixamo.com|Layer0'].action;
      if (prevState) {
        const prevAction = this._parent._proxy._animations[prevState.Name].action;
        curAction.enabled = true;
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
        curAction.crossFadeFrom(prevAction, 0.5, true);
        curAction.play();
      } else {
        curAction.play();
      }
    }
  
    Exit() {
    }
  
    Update(timeElapsed, input) {
      if (input._keys.forward || input._keys.backward) {
        return;
      }
      this._parent.SetState('Armature.001|Sad.Idle.001');
    }
  };

  class IdleState extends State {
    constructor(parent) {
      super(parent);
    }
  
    get Name() {
      return 'Armature.001|Sad.Idle.001';
    }
  
    Enter(prevState) {
      const idleAction = this._parent._proxy._animations['Armature.001|Sad.Idle.001'].action;
      if (prevState) {
        const prevAction = this._parent._proxy._animations[prevState.Name].action;
        idleAction.time = 0.0;
        idleAction.enabled = true;
        idleAction.setEffectiveTimeScale(1.0);
        idleAction.setEffectiveWeight(1.0);
        idleAction.crossFadeFrom(prevAction, 0.5, true);
        idleAction.play();
      } else {
        idleAction.play();
      }
    }
  
    Exit() {
    }
  
    Update(_, input) {
      if (input._keys.forward || input._keys.backward) {
        this._parent.SetState('Armature.001|Armature.002|mixamo.com|Layer0');
      }
    }
  };
  
  
export {BasicCharacterController};