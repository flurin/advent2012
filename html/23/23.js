/*

Digitpaint HTML and CSS Advent 2012

 _____                        _                    ______  ________         _ 
(____ \                      | |                  (_____ \(_______/        | |
 _   \ \ ____ ____ ____ ____ | | _   ____  ____     ____) )  ____   ____ _ | |
| |   | / _  ) ___) _  )    \| || \ / _  )/ ___)   /_____/  (___ \ / ___) || |
| |__/ ( (/ ( (___ (/ /| | | | |_) ) (/ /| |       _______ _____) ) |  ( (_| |
|_____/ \____)____)____)_|_|_|____/ \____)_|      (_______)______/|_|   \____|
                                                                              

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

document.addEventListener("DOMContentLoaded", function(){
  
  var pointerLockError = function(e) {
    console.log("Error while locking pointer.", e);
  }
 
  document.addEventListener('pointerlockerror', pointerLockError, false);
  document.addEventListener('mozpointerlockerror', pointerLockError, false);
  document.addEventListener('webkitpointerlockerror', pointerLockError, false);  
  
  var requestPointerLock = function(container){
    // Lock the pointer
    container.requestPointerLock = container.requestPointerLock  || container.mozRequestPointerLock || container.webkitRequestPointerLock;
      
    if(container.mozRequestFullScreen){
      container.mozRequestFullScreen();
      document.addEventListener('mozfullscreenchange', function fullscreenChange() {
        if (document.mozFullScreenElement === container || document.mozFullscreenElement === container) {
          container.requestPointerLock();
        }
      }, false);
    } else {
      container.requestPointerLock();
    }
  }


  // =======================
  // = The panorama viewer =
  // =======================
  
  !function() {
    
    var panorama = document.getElementById("panorama");

    // create and set up the scene, etc
    var width = panorama.offsetWidth;
    var height = panorama.offsetHeight;
    var origWidth, origHeight;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(35, width / height, 1, 1500);
    var renderer = new THREE.WebGLRenderer({antialias:true});
    var time = 0;
    var ORIGIN = new THREE.Vector3();

    // urls of the images,
    // one per half axis
    var urls = [
          'images/ice_river/posx.jpg',
          'images/ice_river/negx.jpg',
          'images/ice_river/posy.jpg',
          'images/ice_river/negy.jpg',
          'images/ice_river/posz.jpg',
          'images/ice_river/negz.jpg'
        ];

    // wrap it up into the object that we need
    var cubemap = THREE.ImageUtils.loadTextureCube(urls, undefined, function(){
      renderer.render(scene, camera);
    });

    // set the format, likely RGB
    // unless you've gone crazy
    cubemap.format = THREE.RGBFormat;

    // following code from https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_cubemap.html
    var shader = THREE.ShaderUtils.lib[ "cube" ];
    shader.uniforms[ "tCube" ].texture = cubemap;

    var material = new THREE.ShaderMaterial( {

      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false

    });

    var skybox = new THREE.Mesh( new THREE.CubeGeometry( 1000, 1000, 1000 ), material );
    skybox.flipSided = true;

    scene.add(camera);
    scene.add(skybox);

    renderer.setSize(width, height);
    panorama.appendChild(renderer.domElement);
    
    // ====================
    // = Starting the fun =
    // ====================
    
    var pos = {x : 0, y : 0};

    panorama.addEventListener("click", function(){ requestPointerLock(panorama); });
    
    var pointerLockChange = function() {
      var pointerLockElement = document.pointerLockElement    || document.mozPointerLockElement || document.webkitPointerLockElement;
      if (pointerLockElement == panorama) {
        document.addEventListener("mousemove", trackMouse, false);
      } else {
        document.removeEventListener("mousemove", trackMouse);
      }      
    }
    
    var trackMouse  = function(e){
      var movementX = e.movementX       || e.mozMovementX    || e.webkitMovementX || 0,
          movementY = e.movementY       || e.mozMovementY    || e.webkitMovementY || 0;

      // Update the initial co-ords on mouse move
      pos.x += movementX * -0.005;
      pos.y += movementY * -0.0015;
      
      //Change camera position on move
      camera.position.x = Math.sin(pos.x) * 400;
      camera.position.z = Math.cos(pos.x) * 400;
      camera.position.y = Math.atan(pos.y) * 400;
      camera.lookAt(ORIGIN);
          
      renderer.render(scene, camera);      
    }
    
    document.addEventListener("mozfullscreenchange", function(){
      if (document.mozFullScreenElement === panorama || document.mozFullscreenElement === panorama) {
        origWidth = width;
        origHeight = height;
        width = window.screen.width;
        height = window.screen.height;
      } else {
        width = origWidth;
        height = origHeight;
      }

      camera.aspect = width/height;
      camera.updateProjectionMatrix();

      renderer.setSize( width, height);
      renderer.render(scene, camera);
    });
    
    document.addEventListener('pointerlockchange', pointerLockChange, false);
    document.addEventListener('mozpointerlockchange', pointerLockChange, false);
    document.addEventListener('webkitpointerlockchange', pointerLockChange, false);    
    
  }();


  !function(){
    var container = document.getElementById("container");
    var ctx = container.getContext("2d");
    container.width = container.offsetWidth;
    container.height = container.offsetHeight;
  
    container.addEventListener("click", function(){ requestPointerLock(container); });

    var pointerLockChange = function() {
      var pointerLockElement = document.pointerLockElement    || document.mozPointerLockElement || document.webkitPointerLockElement;
      
      // Let's not act if we're not the pointerLock Element
      if(pointerLockElement == container){
        document.addEventListener("mousemove", trackMouse, false);
      } else {
        document.removeEventListener("mousemove", trackMouse);
      }
    }
  
    document.addEventListener('pointerlockchange', pointerLockChange, false);
    document.addEventListener('mozpointerlockchange', pointerLockChange, false);
    document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
  

    var trackMouse  = function(e){
      var movementX = e.movementX       ||
                      e.mozMovementX    ||
                      e.webkitMovementX ||
                      0,
          movementY = e.movementY       ||
                      e.mozMovementY    ||
                      e.webkitMovementY ||
                      0;

      // Store the mousedata to be used in the drawing function
      draw(movementX, movementY)
    }
  
  
    var pos = {x : Math.floor(container.width/2), y : Math.floor(container.height/2)};
    var lPos = {x : pos.x, y : pos.y};  
    var mPos = {x : 0, y : 0, dist : 0};
  
    var segments = [];
    var keepSegments = 30;
    
    var draw = function(dX, dY){
    
      pos.x += dX;
      pos.y += dY;
    
      if(pos.x < 0){ pos.x = 0; }
      if(pos.x > container.width){ pos.x = container.width; }

      if(pos.y < 0){ pos.y = 0; }
      if(pos.y > container.height){ pos.y = container.height; }
    
      segments.unshift({x : pos.x, y : pos.y});
      if(segments.length > keepSegments){
        segments.pop();
      }    
    
      ctx.strokeStyle = "#000";
      ctx.fillStyle = "#000"
      ctx.lineWidth = 4;  
    
      ctx.clearRect(0,0,container.width, container.height);
    
      for(var i=0; i < segments.length; i++){
        var tS = segments[i], nS = segments[i+1];
        if(nS){
          ctx.strokeStyle = "rgba(0,0,0,"+(1/(i+1))+")";

          ctx.beginPath();
          ctx.moveTo(tS.x, tS.y);
          ctx.lineTo(nS.x, nS.y);
          ctx.stroke();        
        } 
      }
    
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI*2, true)
      ctx.fill();

    }
  }();
});