/**
 * This file is part of acti0.js
 * (JavaScript framework for building interactive visualizations in the web browser)
 * https://github.com/aluarosi/acti0.js
 * 
 * Copyright (C) 2013 Alvaro Santamaria Herrero (aluarosi)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// setup_scene3
define(['three','jquery','cube','orbitpan','surface','camera_driver'], 
    function(three, jquery, cube, orbitpan, surface, camera_driver){
    //TODO: THREE is in the global scope now, but three is undefined

    // SETUP function to export
    var setup_scene3 = function(thisapp){
        /** 
         * 'this' refers to acti0.app, where this function is attached as 'setup' listener
         *  EVENTS:
         *      register:   'render' --> update_camera()
         *      register:   'render' --> render()
         *  SHARED:
         *      my_cube, 'cube'
         */

        console.log("setup_scene3");

        // Renderer
        var container = $(thisapp.shared.html_container3d);
        var renderer = new THREE.WebGLRenderer( {antialias: true} );
        renderer.setSize( container.outerWidth(), container.outerHeight() );
        renderer.gammaOutput = false;
        container.append( renderer.domElement );

        // Cameras
        var camera = new THREE.PerspectiveCamera(
            35.0,
            container.outerWidth()/container.outerHeight(),
            0.01, 4000
        );
        camera.position.set( 0, 0, 2 *2.8 );
        camera.position.set( 0, 0, thisapp.config.D0 );

        // On window resize : update camera and renderer dom element size
        window.addEventListener( 'resize',
            function(){
                camera.aspect = container.outerWidth()/container.outerHeight();
                camera.updateProjectionMatrix();
                renderer.setSize( container.outerWidth(), container.outerHeight());
            }, 
            false
        );

        // We add controls to cameras
        var cameraControls = new THREE.OrbitAndPanControls(
            camera, renderer.domElement
        );
        cameraControls.target.set( 0,0,0 );
        // We add the driver to the camera
        // TODO: var cameraDriver = new MY.CameraDriver(camera);


        // SCENE
        var scene = new THREE.Scene(); 
    
        var my_cube = new cube.Cube({
            size    : thisapp.config.size
        });
        my_cube.build(scene);
        var my_surface = new surface.Surface({
            
        });
        my_surface.build(scene);

        // CAMERA DRIVER
        var camdriver1 = new camera_driver.SimpleDriver(camera, thisapp);

        // SHARE
        thisapp.share(my_cube, 'cube');
        thisapp.share(my_surface, 'surface');
    
        // RENDER LOOP
        var update_camera = function(delta){
            // Update Camera
            cameraControls.update(delta);
        };
        var render = function(){
            // Render
            renderer.render(scene, camera);
        };
        thisapp.on('render', update_camera);
        thisapp.on('render', render);


        // Single camera movement (sample, TODO: take it out of here)
        camdriver1.set({
            origin: new THREE.Vector3(0,0,5),
            destination: new THREE.Vector3(0,1,3),
            target_orig: new THREE.Vector3(0,0,0),
            target_dest: new THREE.Vector3(1,1,0),
            fovZ_orig: 1,
            fovZ_dest: 0.7 
        });
        // Deactivate camera draggin while moving camera
        thisapp.removeListener('render', update_camera);
        camdriver1.go(2);
        // Activate camera mouse control
        // but before the target for cameraControls must be updated
        camdriver1.on('done', function(){
            cameraControls.target.copy( camdriver1.target_dest ),
            thisapp.on('render', update_camera);
        });

    }; return setup_scene3;
});
