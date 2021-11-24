
class SceneText {
    
    constructor (text, font, divID = null){
        this.text = text;
        this.font = font;
        this.divID = divID;
        this.mesh;
        this.addText = this.addText.bind(this);
        this.gui_loader = this.gui_loader.bind(this);
        this.get_div_reference = this.get_div_reference.bind(this);

        
    };

    addText(font, scene, models_to_explore, xtra){
        const text = this.text;
        const textMaterial = new THREE.MeshPhongMaterial({
            transparent:true,
            opacity:0.76,
            color:0xffffff,
            emmissive:0xd1d1d1
        });
        const textGeometry = new THREE.TextGeometry(text,
            {
            font: font,
            size: 2.2,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize:  0.2,
            bevelOffset: 0,
            bevelSegments: 2
            }
        );
        textGeometry.center();
        const textMesh = new THREE.Mesh(textGeometry, textMaterial );   
        scene.add(textMesh);
        textMesh.rotation.x = xtra.r.x;
        textMesh.rotation.y = xtra.r.y;
        textMesh.rotation.z = xtra.r.z;
        textMesh.position.set(xtra.p.x,xtra.p.y,xtra.p.z);
        this.mesh=textMesh;
        if (this.divID != null){
            models_to_explore.push(this.get_div_reference());
        };
        if (xtra.gui){this.gui_loader()};
    };

    gui_loader(){
        const gui = new dat.GUI()
        const modelFolder = gui.addFolder(this.text)
        modelFolder.add(this.mesh.rotation, 'x', 0, Math.PI * 2)
        .listen().name("Rotate X");
        modelFolder.add(this.mesh.rotation, 'y', 0, Math.PI * 2)
        .listen().name("Rotate Y");
        modelFolder.add(this.mesh.rotation, 'z', 0, Math.PI * 2)
        .listen().name("Rotate Z");
        modelFolder.add(this.mesh.position, 'x', -100, 100)
        .listen().name("Position X");
        modelFolder.add(this.mesh.position, 'y', -100, 100)
        .listen().name("Position Y");
        modelFolder.add(this.mesh.position, 'z', -100, 100)
        .listen().name("Position Z");
        modelFolder.open()
    }

    get_div_reference(){
        const pos = this.mesh.position;
        return(
            {"x_range":[pos.x - 5, pos.x + 5],
            "z_range":[pos.z - 5, pos.z + 5],
            "div_ID":this.divID}
        )
    }

};

export {SceneText};