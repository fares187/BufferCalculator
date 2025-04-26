//import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
//// To allow for the camera to move around the scene
//import  OrbitControls  from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
//// To allow for importing the .gltf file
//import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
//import * as THREE from 'three';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import * as THREE from '../Libraries/threeJs/three.module.js';
import { GLTFLoader } from '../Libraries/threeJs/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../Libraries/threeJs/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from '../Libraries/threeJs/examples/jsm/controls/OrbitControls.js';

let currentTransition = null;
export async function initThreeJS(canvas, width, height) {
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });

    let currentModel = null;
    let animationFrameId = null;
    const transitionSpeed = 0.05;
    let isTransitioning = false;

    // Lighting setup...
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    new RGBELoader().load("../models/chemitryHDRI.hdr", function (texture) {

        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture,
            scene.environment = texture
    });


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;


    async function initialloadModel(modelUrl) {
        modelUrl = '../models/' + modelUrl
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(modelUrl, function (gltf) {

            scene.add(gltf.scene);

        }, undefined, function (error) {

            console.error(error);

        });
        const model = gltf.scene;
        currentModel = model
        // Center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

    }

    async function loadModel(modelUrl) {
        modelUrl = '../models/' + modelUrl
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(modelUrl);
        const model = gltf.scene;

        // Center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        return model;
    }

    async function transitionModels(newModelUrl) {
        if (currentTransition) {
            currentTransition.cancel();
        }
        newModelUrl = '../models/' + newModelUrl

        const controller = new AbortController();
        currentTransition = controller;
        if (isTransitioning) return;

        try {
            isTransitioning = true;

            // Animate out old model
            if (currentModel) {
                const startX = currentModel.position.x;
                await animatePosition(currentModel, startX, startX - 100, 250);
                scene.remove(currentModel);
            }

            // Load and position new model
            const newModel = await loadModel(newModelUrl);
            newModel.position.x = 10; // Start on right side
            scene.add(newModel);

            // Animate in new model
            await animatePosition(newModel, 100, 0, 250);

            // Update camera position
            const box = new THREE.Box3().setFromObject(newModel);
            const size = box.getSize(new THREE.Vector3()).length();
            camera.position.z = size * 1.5;
            controls.update();

            currentModel = newModel;
            isTransitioning = false;
            return await new Promise((resolve, reject) => {
                controller.signal.addEventListener('abort', () => {
                    reject(new DOMException('Aborted', 'AbortError'));
                });

                // Resolve when transition completes
                animateIn().then(resolve);
            });

        } finally {
            isTransitioning = false;
            currentTransition = null;
        }
    }

    function animatePosition(object, start, end, duration) {
        return new Promise(resolve => {
            const startTime = Date.now();

            function update() {
                const progress = (Date.now() - startTime) / duration;
                object.position.x = start + (end - start) * progress;

                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(update);
                } else {
                    resolve();
                }
            }

            update();
        });
    }

    function animate() {
        controls.update();
        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
    }

    renderer.setSize(width, height);
    animate();

    return {
        transitionModels: (modelUrl) => transitionModels(modelUrl),
        resize: (newWidth, newHeight) => {
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        },
        dispose: () => {
            cancelAnimationFrame(animationFrameId);
            controls.dispose();
            renderer.dispose();
        }
    };
}



//export async function initThreeJS(canvas, width, height) {
//    return new Promise(async (resolve, reject) => {
//        try {
//            // const canvas = document.getElementById("threeCanvas");
//            const scene = new THREE.Scene();
//            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//            const renderer = new THREE.WebGLRenderer({
//                canvas: canvas,
//                antialias: true,
//                alpha: true
//            });
//            //renderer.setSize(parent.clientWidth, parent.clientHeight);
//            /*document.body.appendChild(renderer.domElement);*/

//            // Handle window resize
//            //window.addEventListener('resize', () => {
//            //    const width = parent.clientWidth;
//            //    const height = parent.clientHeight;

//            //    // Update renderer size and camera aspect

//            //    camera.aspect = width / height;
//            //    camera.updateProjectionMatrix();
//            //    renderer.setSize(width, height);
//            //    console.log('resizing')
//            //})

//            let currentModel = null;
//            let animationFrameId = null;
//            const transitionSpeed = 0.05;
//            let isTransitioning = false;

//            /*  lighting and HDRI*/
//            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//            scene.add(ambientLight);
//            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//            directionalLight.position.set(5, 5, 5);
//            scene.add(directionalLight);

//            new RGBELoader().load("../models/chemitryHDRI2.hdr", function (texture) {

//                texture.mapping = THREE.EquirectangularReflectionMapping;
//                scene.background = texture,
//                    scene.environment = texture
//            });



//            camera.position.z = 5;
//            camera.position.x = 5;

//            const controls = new OrbitControls(camera, renderer.domElement);
//            controls.enableDamping = true;
//            controls.dampingFactor = 0.05;

//            export async function initialloadModel(modelUrl) {
//                modelUrl = '../models/' + modelUrl
//                const loader = new GLTFLoader();
//                const gltf = await loader.loadAsync(modelUrl, function (gltf) {

//                    scene.add(gltf.scene);

//                }, undefined, function (error) {

//                    console.error(error);

//                });
//                const model = gltf.scene;

//                // Center model
//                const box = new THREE.Box3().setFromObject(model);
//                const center = box.getCenter(new THREE.Vector3());
//                model.position.sub(center);

//                return model;
//            }
//            async function loadModel(modelUrl) {
//                modelUrl = '../models/' + modelUrl
//                const loader = new GLTFLoader();
//                const gltf = await loader.loadAsync(modelUrl, function (gltf) {

//                               scene.add(gltf.scene);

//                           }, undefined, function (error) {

//                               console.error(error);

//                });

//                const model = gltf.scene;
//                currentModel = model;
//                // Center model
//                const box = new THREE.Box3().setFromObject(model);
//                const center = box.getCenter(new THREE.Vector3());
//                model.position.sub(center);


//            }
//            async function transitionModels(newModelUrl) {
//                newModelUrl = '../models/' + newModelUrl
//                if (isTransitioning) return;
//                isTransitioning = true;

//                // Animate out old model
//                if (currentModel) {
//                    const startX = currentModel.position.x;
//                    await animatePosition(currentModel, startX, startX - 10, 1000);
//                    scene.remove(currentModel);
//                }

//                // Load and position new model
//                const newModel = await loadModel(newModelUrl, function (gltf) {

//                    scene.add(gltf.scene);

//                }, undefined, function (error) {

//                    console.error(error);

//                });
//                newModel.position.x = 10; // Start on right side
//                scene.add(newModel);

//                // Animate in new model
//                await animatePosition(newModel, 10, 0, 1000);

//                // Update camera position
//                const box = new THREE.Box3().setFromObject(newModel);
//                const size = box.getSize(new THREE.Vector3()).length();
//                camera.position.z = size * 1.5;
//                controls.update();

//                currentModel = newModel;
//                isTransitioning = false;
//            }

//            function animatePosition(object, start, end, duration) {
//                return new Promise(resolve => {
//                    const startTime = Date.now();

//                    function update() {
//                        const progress = (Date.now() - startTime) / duration;
//                        object.position.x = start + (end - start) * progress;

//                        if (progress < 1) {
//                            animationFrameId = requestAnimationFrame(update);
//                        } else {
//                            resolve();
//                        }
//                    }

//                    update();
//                });
//            }


//                //loader.load('../models/SodiumCitrate.glb', function (gltf) {

//                //               scene.add(gltf.scene);

//                //           }, undefined, function (error) {

//                //               console.error(error);

//                //           });
//                //loader.load('../models/ChemistryScene.glb', function (gltf) {

//                //    scene.add(gltf.scene);

//                //}, undefined, function (error) {

//                //    console.error(error);

//                //});






//                //const geometry = new THREE.BoxGeometry(1, 1, 1);
//                //const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//                //const cube = new THREE.Mesh(geometry, material);
//                //scene.add(cube);




//                function animate() {

//                    //cube.rotation.x += 0.01;
//                    //cube.rotation.y += 0.01;
//                    controls.update();
//                    renderer.render(scene, camera);
//                    animationFrameId = requestAnimationFrame(animate);
//                }
//                renderer.setSize(width, height);
//                animate();

//                resolve({
//                    resize: (newWidth, newHeight) => { /* ... */ },
//                    dispose: () => { /* ... */ }
//                });
//            } catch (error) {
//                reject(error);
//            }
//        });

//    return {
//        transitionModels: (modelUrl) => transitionModels(modelUrl),
//        resize: (newWidth, newHeight) => {
//            camera.aspect = newWidth / newHeight;
//            camera.updateProjectionMatrix();
//            renderer.setSize(newWidth, newHeight);
//        },
//        dispose: () => {
//            cancelAnimationFrame(animationFrameId);
//            controls.dispose();
//            renderer.dispose();
//        }
//    };
//}