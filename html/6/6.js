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
  navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;
  window.URL = window.webkitURL || window.URL;
  
  var cam = document.getElementById("cam");
  var theStream = null;
  
  // Create a hidden canvas
  // var canvas = document.createElement("canvas");
  var canvas = document.getElementById("canvas");  
  var buffer = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var ctxB = buffer.getContext("2d");
  
  // The reel
  var reel = document.getElementById("video-reel");
  
  var canvasStreamInterval = null;
  
  // Show an error on screen
  var writeError = function(err){
    console.log(err);
  }
  
  var streamStart = function(stream){
    theStream = stream;
    
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
  
  var streamToCanvas = function(){
    
    // Make all the canvasses the same
    // if(cam.videoWidth == 0){
      canvas.width = cam.videoWidth;
      canvas.height = cam.videoHeight;      
      buffer.width = canvas.width;
      buffer.height = canvas.height;
    // }
    
    if(canvas.width > 0){
      // Draw a frame of the live video onto the canvas
      
      // Flip horizontally so it's a mirror
      ctxB.save();
      ctxB.scale(-1, 1);
      ctxB.drawImage(cam, -1*buffer.width, 0, buffer.width, buffer.height);
      ctxB.restore();
      
      // console.log(ctx.getImageData(0, 0, canvas.width, canvas.height));
      // ctx.putImageData(Filters.pixelize(ctxB.getImageData(0, 0, buffer.width, buffer.height),10),0,0);      
      ctx.putImageData(Filters.threshold(ctxB.getImageData(0, 0, buffer.width, buffer.height),80),0,0);            
      // ctx.putImageData(ctxB.getImageData(0,0,buffer.width,buffer.height),0,0);
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
  
  var streamStop = function(){
    theStream.stop();
    theStream = null;
    clearInterval(canvasStreamInterval);
  }
  
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
  
  document.getElementById("video-start").addEventListener("click",function(){
    navigator.getUserMedia({video: true}, streamStart, streamFailed);
  })
  
  document.getElementById("video-stop").addEventListener("click",function(){
    if(theStream){
      streamStop();
    } else {
      writeError("No video started");
    }
  });
  
  document.getElementById("video-snapshot").addEventListener("click", snapshot);  
  
});



// ======================
// = The actual filters =
// ======================
            
var Filters = {  
  // Convert to grayscale
  grayscale : function(pixels) {
    var d = pixels.data;
    for (var i=0; i<d.length; i+=4) {
      var r = d[i];
      var g = d[i+1];
      var b = d[i+2];
      // CIE luminance for the RGB
      // The human eye is bad at seeing red and blue, so we de-emphasize them.
      var v = 0.2126*r + 0.7152*g + 0.0722*b;
      d[i] = d[i+1] = d[i+2] = v
    }
    return pixels;
  },

  // Threshold filter
  // threshold : integer with the threshold for r+g+b
  threshold : function(pixels, threshold){
    var d = pixels.data;
    for (var i=0; i<d.length; i+=4) {
      var r = d[i];
      var g = d[i+1];
      var b = d[i+2];
                  
      var v = 0;
      if((r + g + b) > threshold){
        v = 255;
      } 
      d[i] = v; d[i+1] = v; d[i+2] = v;
    }
    return pixels;
  },
              
  // Pixelize the image
  pixelize : function(pixels, radius){
    var d = pixels.data;
    
    // Failsafe so we don't end up in an endless loop
    if(radius == 0){
      return pixels;
    }

    // Walk through width x height pixels.
    for(var x=0; x < pixels.width; x+=radius){
      for(var y=0; y < pixels.height; y+=radius){
        var r = 0, g = 0, b = 0, count = 0;;

        // Average our pixels and count the amount of averaged pixels
        // We need to coutn them because of edge pixels
        for(var rX=x; rX < Math.min(x + radius, pixels.width); rX++){
          for(var rY=y; rY < Math.min(y + radius, pixels.height); rY++){
            var pos = (rY*pixels.width + rX) * 4;
            count += 1;
            r += d[pos];
            g += d[pos + 1];
            b += d[pos + 2];
          }
        }
                    
        // Set the averaged colors to the pixels.
        for(var rX=x; rX < Math.min(x + radius, pixels.width); rX++){
          for(var rY=y; rY < Math.min(y + radius, pixels.height); rY++){
            var pos = (rY*pixels.width + rX) * 4;
            d[pos] = r/count;
            d[pos + 1] = g/count;
            d[pos + 2] = b/count;
          }
        }                    
      }                  
    }
    return pixels;
  }
}  