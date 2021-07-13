<script>
    import { user, modelDoc } from '../stores';
    import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
	import { onDestroy, onMount } from 'svelte';
    import * as dat from 'dat.gui';

    // firebase stuff
    import firebase from 'firebase/app';
    import { db } from '../firebase';

    const modelDocRef = db.collection('models').doc($modelDoc);
 
    let markersInScene = [];

    const unsubscribe = modelDocRef.onSnapshot((snapshot) => {
        let markers = [];
        markers = snapshot.data().markers;

        if (markers.length > 0) {
            markers.forEach(marker => {
                // check if the marker is already spawned.
                // if it is, don't spawn it again.
                if (markersInScene.includes(marker.id)) {
                    console.log('marker already in scene');
                } else {
                    markersInScene.push(marker.id);
                    // make sure the last argument is false or we get caught in an endless loop!
                    spawnMarker(marker.x, marker.y, marker.z, marker.text, marker.poster, false);
                }
            })
        } else {
            console.log('no markers saved');
        }
    });

    onDestroy(unsubscribe);

    async function writeDb(xPos, yPos, zPos, text) {
        const markerModel = {
            // the id has to be unique and auto generated
            id: Math.floor(Math.random() * 100000),
            parent: INTERSECTED.name,
            poster: $user.displayName,
            x: xPos,
            y: yPos,
            z: zPos,
            text: text,
            timestamp: firebase.firestore.Timestamp.now()
        }

        markersInScene.push(markerModel.id);

        await modelDocRef.update({
            markers: firebase.firestore.FieldValue.arrayUnion(markerModel)
        });
    }

    // this is the only important one -- this sets the file path to the model
    export let modelToShow;

    let structureName;
	let renderElement;

	const scene =  new THREE.Scene();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

	scene.background = new THREE.Color(0x0e0e0e);

	const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize((window.innerWidth), (window.innerHeight / 2));
    
	const camera = new THREE.PerspectiveCamera(45, (window.innerWidth) / (window.innerHeight / 2), 1, 1000);
    camera.position.x = -300;
    camera.position.z = -300;
    camera.lookAt(scene.position);
    scene.add(camera);

    // set axis
    const axesHelper = new THREE.AxesHelper(200);
    scene.add(axesHelper)

    // set lights
	const spotlight = new THREE.SpotLight(0xffffff, 0.5);
	spotlight.position.set(0, 700, 0);
	scene.add(spotlight);

    const pointLight1 = new THREE.PointLight(0xffffff, 0.75);
    pointLight1.position.set(0, 70, 150);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.50);
    pointLight2.position.set(0, 70, -150);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 0.75);
    pointLight3.position.set(150, 70, 0);
    scene.add(pointLight3);

    const pointLight4 = new THREE.PointLight(0xffffff, 0.50);
    pointLight4.position.set(-150, 70, 0);
    scene.add(pointLight4);

    const pointLight5 = new THREE.PointLight(0xffffff, 0.3);
    pointLight5.position.set(-60, -20, 0);
    scene.add(pointLight5);

    const lightList = [
        pointLight1, pointLight2, pointLight3, pointLight4, pointLight5
    ];

    const lightHelpers = lightList.map(light => new THREE.PointLightHelper(light, 25));
    lightHelpers.forEach(helper => {
        helper.visible = false;
        scene.add(helper);
    })

    // clipping plane(s)
    const clippingPlaneAxial = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1);
    const clippingPlaneSaggital = new THREE.Plane(new THREE.Vector3(0, 0, -1), 1);
    const clippingPlaneCoronal = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1);

    const clippingPlaneAxialHelper = new THREE.PlaneHelper(clippingPlaneAxial, 350, 0x00ff48);
    const clippingPlaneSaggitalHelper = new THREE.PlaneHelper(clippingPlaneSaggital, 350, 0xeb3131);
    const clippingPlaneCoronalHelper = new THREE.PlaneHelper(clippingPlaneCoronal, 350, 0x0377fc);

    let planeHelpers = [clippingPlaneAxialHelper, clippingPlaneSaggitalHelper, clippingPlaneCoronalHelper];

    planeHelpers.forEach(helper => {
        helper.visible = false;
        scene.add(helper);
    })

    renderer.localClippingEnabled = true;
    
	onMount(async () => {
		renderElement.appendChild(renderer.domElement);
	});

	const controls = new OrbitControls(camera, renderer.domElement);

    controls.mouseButtons = {
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.ROTATE,
    }
    controls.maxDistance = 500;
    controls.minDistance = 75;
    controls.panSpeed = 0.5;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.5;

    const loader = new GLTFLoader();
	const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('draco/gltf/');
    loader.setDRACOLoader(dracoLoader);

    // just the models we want for the ui
	let sceneObjects = [];

    // all objects we want to raycast through
    let intersectObjects = [];
	loader.load(modelToShow, function (gltf) {
		scene.add( gltf.scene );

		gltf.scene.children.forEach(child => {
            if (child.type === 'Mesh') {
                sceneObjects.push(child);
                sceneObjects = sceneObjects;
            }
		})

        // set properties for each model here
        sceneObjects.forEach(model => {
            model.material.clipShadows = true;
            model.material.transparent = true;
            model.material.side = THREE.DoubleSide;
            intersectObjects.push(model);
        })
        // console.log(sceneObjects);

        // only load the gui after the models are loaded
        loadGUI();
	}, undefined, function (error) {
		console.log(error);
	})

    window.addEventListener('resize', onWindowResize, false)
    
    function onWindowResize() {
        camera.aspect = (window.innerWidth) / (window.innerHeight / 2);
        camera.updateProjectionMatrix();
        renderer.setSize((window.innerWidth), (window.innerHeight / 2));
    }

    // GUI
    let gui;

    const planeParams = {

        axialPlane: {
            "Axial Clipping": false,
            "Axial Position": clippingPlaneAxial.constant,
            "Invert Axial": false,
            "Reset Axial" : () => {
                clippingPlaneAxial.constant = 1;
            }
        },

        saggitalPlane: {
            "Saggital Clipping": false,
            "Saggital Position": clippingPlaneSaggital.constant,
            "Invert Saggital": false,
            "Reset Saggital" : () => {
                clippingPlaneSaggital.constant = 1;
            }        
        },

        coronalPlane: {
            "Coronal Clipping": false,
            "Coronal Position": clippingPlaneCoronal.constant,
            "Invert Coronal": false,
            "Reset Coronal" : () => {
                clippingPlaneCoronal.constant = 1;
            }
        },
    }

    function loadGUI() {
        gui = new dat.GUI();
        gui.width = 350;

        // model controls
        sceneObjects.forEach(model => {
            const objectFolder = gui.addFolder(`${model.name}`)
            objectFolder.add(model, 'visible', true, false).name('Visible').onChange(v => {
                if (v) {
                    model.layers.mask = 1;
                } else {
                    model.layers.mask = 2;
                }
            });

            objectFolder.add(model.material, 'wireframe', false, true).name(`Wireframe`).listen();
        })
        
        // scene controls
        const lightFolder = gui.addFolder('Lighting Control');

        lightList.forEach(light => {
            lightFolder.add(light, 'intensity', 0, 1).name(`${light.type} Intensity`).listen();
        })

        const clippingPlaneFolder = gui.addFolder('Clipping Planes')

        let clippingPlanes = [];

        clippingPlaneFolder.add(planeParams.axialPlane, 'Axial Clipping').onChange(v => {planeToggle(v, clippingPlaneAxial, planeHelpers[0], axPos, axNegate, axReset);});
        let axPos = clippingPlaneFolder.add(planeParams.axialPlane, 'Axial Position').min(-100).max(200).onChange(c => clippingPlaneAxial.constant = c)
        let axNegate = clippingPlaneFolder.add(planeParams.axialPlane, 'Invert Axial').onChange(() => {
                clippingPlaneAxial.negate();
                planeParams.axialPlane.constant = clippingPlaneAxial.constant;
            }
        )
        let axReset = clippingPlaneFolder.add(planeParams.axialPlane, 'Reset Axial');

        clippingPlaneFolder.add(planeParams.saggitalPlane, 'Saggital Clipping').onChange(v => {planeToggle(v, clippingPlaneSaggital, planeHelpers[1], sagPos, sagNegate, sagReset);});
        let sagPos = clippingPlaneFolder.add(planeParams.saggitalPlane, 'Saggital Position').min(-100).max(200).onChange(c => clippingPlaneSaggital.constant = c)
        let sagNegate = clippingPlaneFolder.add(planeParams.saggitalPlane, 'Invert Saggital').onChange(() => {
                clippingPlaneSaggital.negate();
                planeParams.saggitalPlane.constant = clippingPlaneSaggital.constant;
            }
        )
        let sagReset = clippingPlaneFolder.add(planeParams.saggitalPlane, 'Reset Saggital');

        clippingPlaneFolder.add(planeParams.coronalPlane, 'Coronal Clipping').onChange(v => {planeToggle(v, clippingPlaneCoronal, planeHelpers[2], corPos, corNegate, corReset);});
        let corPos = clippingPlaneFolder.add(planeParams.coronalPlane, 'Coronal Position').min(-100).max(200).onChange(c => clippingPlaneCoronal.constant = c)
        let corNegate = clippingPlaneFolder.add(planeParams.coronalPlane, 'Invert Coronal').onChange(() => {
                clippingPlaneCoronal.negate();
                planeParams.coronalPlane.constant = clippingPlaneCoronal.constant;
            }
        )
        let corReset = clippingPlaneFolder.add(planeParams.coronalPlane, 'Reset Coronal');

        // all off by default
        const planeControls = [axPos, sagPos, corPos, axNegate, sagNegate, corNegate];
        planeControls.forEach(control => {
            control.domElement.style.pointerEvents = 'none';
            control.domElement.style.opacity = 0.5;
        })

        function planeToggle(visible, plane, helper, positionControl, negateControl, resetControl) {
            const controls = [positionControl, negateControl, resetControl];

            if (visible) {
                clippingPlanes.push(plane);
                controls.forEach(c => {
                    c.domElement.style.pointerEvents = 'auto';
                    c.domElement.style.opacity = 1;
                })
            } else {
                clippingPlanes.pop(plane);
                controls.forEach(c => {
                    c.domElement.style.pointerEvents = 'none';
                    c.domElement.style.opacity = 0.25;
                })
            }

            sceneObjects.forEach(model => {
                model.material.clippingPlanes = clippingPlanes
            })
            
            helper.visible = visible;
        }
    }

    // mouse events
    function onMouseMove(e) {
        e.preventDefault();

        mouse.x = (e.offsetX / (window.innerWidth)) * 2 - 1;
        mouse.y = - (e.offsetY / (window.innerHeight / 2)) * 2 + 1;
    } 

    window.addEventListener('mousemove', onMouseMove, false);

    function doubleClickCheck() {
        if ($user) {
            onDoubleClick();
        } else {
            window.confirm("Please login to leave a marker");
        }
    }

    function onDoubleClick() {
        // check to see if current user is the poster of the marker
        if (INTERSECTED.geometry.type === 'SphereGeometry') {
            if (window.confirm("Are you sure you want to delete this marker?")) {
                INTERSECTED.parent.remove(INTERSECTED);
                scene.remove(INTERSECTED);
                console.log(`user deleted ${INTERSECTED}`)
            } else {
                console.log('user cancelled delete');
            }
        } else {
            const text = window.prompt("Add a comment", "");

            if (text === null | text === "") {
                console.log('user cancelled or input is empty');
            } else {
                spawnMarker(rayIntersectPoint.x, rayIntersectPoint.y, rayIntersectPoint.z, text, $user.displayName, true);
            }
        }
    }

    function spawnMarker(x, y, z, text, poster, writeToDb) {
        const xPos = x;
        const yPos = y;
        const zPos = z;

        const geometry = new THREE.SphereGeometry(4, 8, 8);

        // check if the user is the poster of the marker
        // if they are, make the marker the teal-ish colour
        // otherwise make it white
        let material;

        if (!$user) {
            material = new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1});
        } else if (poster === $user.displayName) {
            material = new THREE.MeshLambertMaterial({color: 0x0ec2a7, emissive: 0x0ec2a7, emissiveIntensity: 1});
        } else {
            material = new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1});
        }

        const sphere = new THREE.Mesh(geometry, material);
        sphere.receiveShadow = true;
        sphere.name = text;

        sphere.position.set(xPos, yPos, zPos);
        scene.add(sphere);

        // sets parenting prior to loading from database
        if (INTERSECTED != null) {
            // setParent(sphere, INTERSECTED);
            INTERSECTED.add(sphere);
        } 

        // allows us to mouse over the markers, but not consider them part of the UI to control apperance
        intersectObjects.push(sphere);

        if (!writeToDb) {
            console.log('reloading from db');
        } else {
            writeDb(xPos, yPos, zPos, text); 
        }
    }

    function setParent(object, parent) {
        console.log(parent.name);
        parent.add(object);
    }

    window.addEventListener('dblclick', doubleClickCheck, false);

    let INTERSECTED;
    let rayIntersectPoint;

	function render() {
        raycaster.setFromCamera(mouse, camera);
        
        const intersects = raycaster.intersectObjects(intersectObjects, true);

        // modified from:
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
        if (intersects.length > 0) {
            rayIntersectPoint = intersects[0].point;

            if (INTERSECTED != intersects[0].object) {

                if (INTERSECTED) {
                    INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                }

                INTERSECTED = intersects[0].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex(0x9fffc7);
                INTERSECTED.material.emissiveIntensity = 0.5;

                structureName = INTERSECTED.name;
                console.log(INTERSECTED.name);
            }

        } else {
            if (INTERSECTED) {
                INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                INTERSECTED.material.emissiveIntensity = 0;
            }
            
            INTERSECTED = null;
            structureName = 'No structure selected';
        }

		renderer.render(scene, camera);
	}
	
	// render/animate loop needed to display in browser
	function animate() {
        requestAnimationFrame(animate);
		render();
	}

	animate();
</script>

<div class="main">
    <div class="model-viewer-container">
        <h2>{structureName}</h2>
        <div class="model-viewer" bind:this={renderElement} />
    </div>
</div>

<style>

.model-viewer {
    background-color: #0e0e0e;
    display: grid;
    justify-content: center;
}

</style>