/*

Digitpaint HTML and CSS Advent 2012

d8888b. d88888b  .o88b. d88888b .88b  d88. d8888b. d88888b d8888b.      dD   d888888b db   db 
88  `8D 88'     d8P  Y8 88'     88'YbdP`88 88  `8D 88'     88  `8D     d8'   `~~88~~' 88   88 
88   88 88ooooo 8P      88ooooo 88  88  88 88oooY' 88ooooo 88oobY'    d8'       88    88ooo88 
88   88 88~~~~~ 8b      88~~~~~ 88  88  88 88~~~b. 88~~~~~ 88`8b     d8888b.    88    88~~~88 
88  .8D 88.     Y8b  d8 88.     88  88  88 88   8D 88.     88 `88.   88' `8D    88    88   88 
Y8888D' Y88888P  `Y88P' Y88888P YP  YP  YP Y8888P' Y88888P 88   YD   `8888P     YP    YP   YP 
                                                                                              
                                                                                              

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

document.addEventListener("DOMContentLoaded", function(){
  navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia;
  window.URL = window.webkitURL ||  window.URL;
  
  var cam = document.getElementById("cam");
  var teaser = document.getElementById("teaser");  
  var theStream = null;

  // Get the canvas
  var canvas = document.getElementById("canvas");  
  var ctx = canvas.getContext("2d");
  
  // Prepare the buffer
  var buffer = document.createElement("canvas");
  var ctxB = buffer.getContext("2d");
  
  // The reel
  var reel = document.getElementById("video-reel");
  
  // The interval timer that draws the video to the canvas.
  var canvasStreamInterval = null;
  
  var currentFilter = null;
  
  // Load viewfinder images
  var viewFinders = [];  
  var viewFinderImages = ["/6/viewfinders/vf1.jpg", "/6/viewfinders/vf2.jpg"];
  
  for(var i=0; i < viewFinderImages.length; i++){
    var img = new Image();
    img.src = viewFinderImages[i];
    viewFinders[i] = img;
  }
  
  // Show an error on screen
  var writeError = function(err){
    if(window.console && window.console.log){
      console.log(err);
    }
    teaser.innerText = err;
  }
  
  var streamStart = function(stream){
    theStream = stream;
    
    teaser.style.display = "none";
    
    if (window.URL) {
      cam.src = window.URL.createObjectURL(stream);
    } else {
      cam.src = stream; // Opera.
    }

    // Something went wrong with the video object
    cam.addEventListener("error", streamStop)
    
    // Transfer the image every 15 secs to the canvas
    canvasStreamInterval = setInterval(streamToCanvas, 1000/15);
  }
  
  // Stream the video to the canvas.
  var streamToCanvas = function(){
              
    if(cam.readyState == 4){
      // Make all the canvasses the same      
      canvas.width = cam.videoWidth;
      canvas.height = cam.videoHeight;      
      buffer.width = canvas.width;
      buffer.height = canvas.height;
      
      
      // Flip horizontally so it's a mirror
      ctxB.save();
      ctxB.scale(-1, 1);
      ctxB.drawImage(cam, -1*buffer.width, 0, buffer.width, buffer.height);
      ctxB.restore();
      
      // Apply filters
      applyFilters(buffer, ctxB);
      
      // Draw a frame of the live video onto the canvas      
      ctx.putImageData(ctxB.getImageData(0,0,buffer.width,buffer.height),0,0);
    }
  }
  
  // Failure callback if we couldn't get a stream from the camera
  var streamFailed = function(e){
    var msg = 'No camera available.';
    if (e.code == 1) {
      msg = 'User denied access to use camera.';
    }
    writeError(msg);    
  }
  
  // Stop the stream
  var streamStop = function(){
    theStream.stop();
    theStream = null;
    clearInterval(canvasStreamInterval);
    teaser.style.display = "block";
  };
  
  // Apply a filter configuration
  var applyFilters = function(canvas, ctx){
    if(!currentFilter){ return; }
        
    if(currentFilter.vignette && currentFilter.vignette.black && currentFilter.vignette.white){
      applyVignetteEffect(canvas, ctx, currentFilter.vignette.black, currentFilter.vignette.white);      
    }
    
    if(currentFilter.viewFinder && currentFilter.viewFinder()){
      if(!currentFilter.overlayPixels){
        var img = currentFilter.viewFinder();
        var bufferVf = document.createElement("canvas");
        var ctxBVf = bufferVf.getContext("2d");    

        bufferVf.width = canvas.width;
        bufferVf.height = canvas.height;
        ctxBVf.drawImage(img, 0,0,img.width,img.height, 0,0, bufferVf.width, bufferVf.height);
    
        currentFilter.overlayPixels = ctxBVf.getImageData(0,0,bufferVf.width, bufferVf.height).data;           
      }
    }

    applyPixelFilters(canvas, ctx, currentFilter.pixelFilters);    
  }
  
  
  // Apply an array of filters to the canvas
  // The array of filters must be an array of functions that accept
  // exactly two parameters (the pixel array and the iteration)
  var applyPixelFilters = function(canvas, ctx, filters){
    if(!filters || filters.length == 0){ return; }
    
    var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);

    for (var i=0; i < imageData.data.length; i+=4) {
      for(var f=0; f < filters.length; f++){
        filters[f](imageData.data, i);
      }
    }
    ctx.putImageData(imageData,0,0);
    
  };
  
  // Tage a snapshot and append it to the image reel.
  var snapshot = function(){
    
    // Create an image element with the canvas image data
    img = document.createElement("img");
    img.className = "snapshot";
    img.src = canvas.toDataURL("image/png");
    img.width = canvas.width / 2;
    img.height = canvas.height / 2;
    
    reel.appendChild(img);
    
  };
  
  // ==============================
  // = Event handlers for buttons =
  // ==============================
  
  document.getElementById("video-control").addEventListener("click",function(){
    var button = this;
    if(theStream){
      button.innerHTML = "Start video";
      streamStop();
    } else {
      navigator.getUserMedia({video: true}, function(stream){
        button.innerHTML = "Stop video";
        streamStart(stream);
      }, streamFailed);
    }
  })
    
  document.getElementById("video-snapshot").addEventListener("click", snapshot);  
  
  document.getElementById("video-filter").addEventListener("change", function(){
    currentFilter = FilterPresets[this.value];
  });
  
  var FilterPresets = {
    "threshold" : {
      pixelFilters : [
        function(pixels, i){ PixelFilters.threshold(pixels, i, 175); }
      ]
    },
    "vintage1" : {
      vignette : {
        black: 0.6,
        white: 0.1
      },
      viewFinder :  function(){ return viewFinders[0]; }, // We need to call this one deferred, as image may not be loaded yet
      pixelFilters : [
        function(pixels, i){ PixelFilters.desaturate(pixels, i, -0.5); },
        function(pixels, i){ PixelFilters.noise(pixels, i, 30)},
        function(pixels, i){ PixelFilters.overlay(pixels, currentFilter.overlayPixels, i);}
      ]
    },
    "vintage2" : {
      vignette : {
        black: 0.8,
        white: 0
      },
      viewFinder : function(){ return viewFinders[1]; }, // We need to call this one deferred, as image may not be loaded yet
      pixelFilters : [
        function(pixels, i){ PixelFilters.curve(pixels, i, PixelFilters.VINTAGE_CURVE)},
        function(pixels, i){ PixelFilters.noise(pixels, i, 30)},
        function(pixels, i){ PixelFilters.overlay(pixels, currentFilter.overlayPixels, i);}
      ]      
    },
    "grayscale" : {
      pixelFilters : [
        function(pixels, i){ PixelFilters.grayscale(pixels, i); }
      ]
    }
  }
  


  // ======================
  // = The actual filters =
  // ======================
  // Preset and some filters are from vintageJS jQuery plugin by Robert Fleischmann (http://vintagejs.com/)
  var PixelFilters = {
    VINTAGE_CURVE : {
      r : [0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 17, 18, 19, 19, 20, 21, 22, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40, 41, 42, 44, 45, 47, 48, 49, 52, 54, 55, 57, 59, 60, 62, 65, 67, 69, 70, 72, 74, 77, 79, 81, 83, 86, 88, 90, 92, 94, 97, 99, 101, 103, 107, 109, 111, 112, 116, 118, 120, 124, 126, 127, 129, 133, 135, 136, 140, 142, 143, 145, 149, 150, 152, 155, 157, 159, 162, 163, 165, 167, 170, 171, 173, 176, 177, 178, 180, 183, 184, 185, 188, 189, 190, 192, 194, 195, 196, 198, 200, 201, 202, 203, 204, 206, 207, 208, 209, 211, 212, 213, 214, 215, 216, 218, 219, 219, 220, 221, 222, 223, 224, 225, 226, 227, 227, 228, 229, 229, 230, 231, 232, 232, 233, 234, 234, 235, 236, 236, 237, 238, 238, 239, 239, 240, 241, 241, 242, 242, 243, 244, 244, 245, 245, 245, 246, 247, 247, 248, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
      g : [0, 0, 1, 2, 2, 3, 5, 5, 6, 7, 8, 8, 10, 11, 11, 12, 13, 15, 15, 16, 17, 18, 18, 19, 21, 22, 22, 23, 24, 26, 26, 27, 28, 29, 31, 31, 32, 33, 34, 35, 35, 37, 38, 39, 40, 41, 43, 44, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 83, 84, 85, 86, 88, 89, 90, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 105, 106, 107, 108, 109, 111, 113, 114, 115, 117, 118, 119, 120, 122, 123, 124, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137, 138, 140, 141, 142, 144, 145, 146, 148, 149, 150, 151, 153, 154, 155, 157, 158, 159, 160, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174, 175, 176, 177, 178, 179, 181, 182, 183, 184, 186, 186, 187, 188, 189, 190, 192, 193, 194, 195, 195, 196, 197, 199, 200, 201, 202, 202, 203, 204, 205, 206, 207, 208, 208, 209, 210, 211, 212, 213, 214, 214, 215, 216, 217, 218, 219, 219, 220, 221, 222, 223, 223, 224, 225, 226, 226, 227, 228, 228, 229, 230, 231, 232, 232, 232, 233, 234, 235, 235, 236, 236, 237, 238, 238, 239, 239, 240, 240, 241, 242, 242, 242, 243, 244, 245, 245, 246, 246, 247, 247, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 255],
      b : [53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 57, 57, 57, 58, 58, 58, 59, 59, 59, 60, 61, 61, 61, 62, 62, 63, 63, 63, 64, 65, 65, 65, 66, 66, 67, 67, 67, 68, 69, 69, 69, 70, 70, 71, 71, 72, 73, 73, 73, 74, 74, 75, 75, 76, 77, 77, 78, 78, 79, 79, 80, 81, 81, 82, 82, 83, 83, 84, 85, 85, 86, 86, 87, 87, 88, 89, 89, 90, 90, 91, 91, 93, 93, 94, 94, 95, 95, 96, 97, 98, 98, 99, 99, 100, 101, 102, 102, 103, 104, 105, 105, 106, 106, 107, 108, 109, 109, 110, 111, 111, 112, 113, 114, 114, 115, 116, 117, 117, 118, 119, 119, 121, 121, 122, 122, 123, 124, 125, 126, 126, 127, 128, 129, 129, 130, 131, 132, 132, 133, 134, 134, 135, 136, 137, 137, 138, 139, 140, 140, 141, 142, 142, 143, 144, 145, 145, 146, 146, 148, 148, 149, 149, 150, 151, 152, 152, 153, 153, 154, 155, 156, 156, 157, 157, 158, 159, 160, 160, 161, 161, 162, 162, 163, 164, 164, 165, 165, 166, 166, 167, 168, 168, 169, 169, 170, 170, 171, 172, 172, 173, 173, 174, 174, 175, 176, 176, 177, 177, 177, 178, 178, 179, 180, 180, 181, 181, 181, 182, 182, 183, 184, 184, 184, 185, 185, 186, 186, 186, 187, 188, 188, 188, 189, 189, 189, 190, 190, 191, 191, 192, 192, 193, 193, 193, 194, 194, 194, 195, 196, 196, 196, 197, 197, 197, 198, 199]
    },
    grayscale : function(pixels, i){
      var r = pixels[i];
      var g = pixels[i+1];
      var b = pixels[i+2];
      // CIE luminance for the RGB
      // The human eye is bad at seeing red and blue, so we de-emphasize them.
      var v = 0.2126*r + 0.7152*g + 0.0722*b;
      pixels[i] = pixels[i+1] = pixels[i+2] = v;
    },
    threshold : function(pixels, i, threshold){
      var r = pixels[i];
      var g = pixels[i+1];
      var b = pixels[i+2];
                  
      var v = 0;
      if((r + g + b) > threshold){
        v = 255;
      } 
      pixels[i] = v; 
      pixels[i+1] = v; 
      pixels[i+2] = v;    
    },
    desaturate : function(pixels, i, amount){
      var average = ( pixels[i] + pixels[i+1] + pixels[i+2] ) / 3;
    
      pixels[i  ] += Math.round( ( average - pixels[i  ] ) * amount );
      pixels[i+1] += Math.round( ( average - pixels[i+1] ) * amount );
      pixels[i+2] += Math.round( ( average - pixels[i+2] ) * amount );    
    },
    curve : function(pixels, i, curve){
      pixels[i  ] = curve.r[pixels[i  ]];
      pixels[i+1] = curve.g[pixels[i+1]];
      pixels[i+2] = curve.b[pixels[i+2]];
    },
    screen : function(pixels, i, strength, amountR, amountG, amountB){
      pixels[i  ] = 255 - ((255 - pixels[i  ]) * (255 - amountrR * strength) / 255);
      pixels[i+1] = 255 - ((255 - pixels[i+1]) * (255 - amountrG * strength) / 255);
      pixels[i+2] = 255 - ((255 - pixels[i+2]) * (255 - amountrB * strength) / 255);
    },
    noise : function(pixels, i, amount){
      var noise = Math.round(amount - Math.random() * amount/2);

      var dblHlp = 0;
      for(var k=0; k<3; k++){
        dblHlp = noise + pixels[i+k];
        pixels[i+k] = ((dblHlp > 255)? 255 : ((dblHlp < 0)? 0 : dblHlp));
      }    
    },
    overlay : function(pixels, pixels2, i){
      if(pixels2 == undefined || pixels2 && pixels.length != pixels2.length){ return; }
    
      //red channel
      var red = ( pixels[i  ] * pixels2[i  ]) / 255;
      pixels[i  ] = red > 255 ? 255 : red < 0 ? 0 : red;

      //green channel
      var green = ( pixels[i+1] * pixels2[i+1]) / 255;
      pixels[i+1] = green > 255 ? green : green < 0 ? 0 : green;

      //blue channel
      var blue = ( pixels[i+2] * pixels2[i+2]) / 255;
      pixels[i+2] = blue > 255 ? 255 : blue < 0 ? 0 : blue;
    }
  }

  /**
   * Adds a vignette effect to the canvas with a lighten effect in the middle and a darken effect on the edges
   */
  var applyVignetteEffect = function (canvas, ctx, blackAmount, whiteAmount) {
    var gradient;
    var outerRadius = Math.sqrt( Math.pow(canvas.width/2, 2) + Math.pow(canvas.height/2, 2) );
    ctx.globalCompositeOperation = 'source-over';
    gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, outerRadius);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.65, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,' + blackAmount + ')');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'lighter';
    gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, outerRadius);
    gradient.addColorStop(0, 'rgba(255,255,255,' + whiteAmount + ')');
    gradient.addColorStop(0.65, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };




  
});


