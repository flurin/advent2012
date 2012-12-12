/*

Digitpaint HTML and CSS Advent 2012

  ______                                  __                    _____  _______  __    __    
 |   _  \  .-----..----..-----..--------.|  |--..-----..----.  | _   ||       ||  |_ |  |--.
 |.  |   \ |  -__||  __||  -__||        ||  _  ||  -__||   _|  |.|   ||___|   ||   _||     |
 |.  |    \|_____||____||_____||__|__|__||_____||_____||__|    `-|.  | /  ___/ |____||__|__|
 |:  1    /                                                      |:  ||:  1  \              
 |::.. . /                                                       |::.||::.. . |             
 `------'                                                        `---'`-------'             
                                                                                            

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

document.addEventListener("DOMContentLoaded", function(){
  
  // Normalize vendor prefixes
  navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia;
  window.URL = window.webkitURL ||  window.URL;
  
  // Wrapper for IE10 so the d/l links work there too.
  var saveData = function(link, data, contentType){
    var blob;
      
    // Creating a blob with binary data seems to fail in IE10 preview
    if(window.MSBlobBuilder){
      var bb = MSBlobBuilder();
      bb.append(data);
      blob = bb.getBlob(contentType);
      navigator.msSaveBlob(blob, link.getAttribute("download") || "file");
    } else {
      blob = new Blob([data], {"type" : contentType});
      link.href = URL.createObjectURL(blob);        
    }
    
  }  
  
  // ==========================
  // = Simple file generation =
  // ==========================
  
  
  var contentEl = document.getElementById("file-content");
  var dlTxt = document.getElementById("download-txt");
  var dlHtml = document.getElementById("download-html");
              
  dlTxt.addEventListener("click", function(){
    saveData(this, contentEl.value, "text/plain")
  });
              
  dlHtml.addEventListener("click", function(){
    saveData(this, "<html><head><title>Generated a HTML file!</title></head><body>" + contentEl.value + "</body></html>", "text/plain")
  });  
  
  
  // ============================
  // = The animated gif creator =
  // ============================
  
  var cam = document.getElementById("cam");
  
  // Prepare the buffer
  var buffer = document.createElement("canvas");
  var ctxB = buffer.getContext("2d");
  
  var dlGif = document.getElementById("download-gif");
  var recBtn = document.getElementById("record");
  var sourceWebcamBtn = document.getElementById("select-webcam");
  var sourceVideoBtn = document.getElementById("select-file");  
  var videoFileInput = document.getElementById("video-file");
  var selectSourceEl = document.getElementById("select-source");
  var recStatusEl = document.getElementById("record-status");
  
  if(!navigator.getUserMedia){
    sourceWebcamBtn.classList.add("hidden");
  }
  
  var fps = 10;  
  var maxFrames = 30;
  var maxWidth = 200;
  var scale = 1;
  var collectedFrames = 0;
  var canvasStreamInterval = null;
  var encoder = null;
  
  var theStream = null;
  
  // Show an error on screen
  var writeError = function(err){
    if(window.console && window.console.log){
      console.log(err);
    }
  }
  
  var streamStart = function(stream){
    theStream = stream;
    
    if (window.URL) {
      cam.src = window.URL.createObjectURL(stream);
    } else {
      cam.src = stream; // Opera.
    }
    
    // Something went wrong with the video object
    cam.addEventListener("error", streamStop);
    
  }
  
  // Stop the stream
  var streamStop = function(){
    theStream.stop();
    theStream = null;
    clearInterval(canvasStreamInterval);
  };  
  
  var streamFailed = function(e){
    var msg = 'No camera available.';
    if (e.code == 1) {
      msg = 'User denied access to use camera.';
    }
    writeError(msg);    
  }
  
  sourceVideoBtn.addEventListener("click", function(e){
    videoFileInput.click();
    e.preventDefault();
  }, false);

  videoFileInput.addEventListener("change", function(){
    v = this.files[0];
    cam.src = window.URL.createObjectURL(this.files[0]);
    cam.controls = true;
    cam.classList.remove("hidden");
    selectSourceEl.classList.add("hidden");
    
  });
  
  sourceWebcamBtn.addEventListener("click", function(){
    navigator.getUserMedia({video: true}, function(stream){
      streamStart(stream);
      cam.controls = false;
      cam.classList.remove("hidden");  
      cam.play();    
      selectSourceEl.classList.add("hidden");      
    }, streamFailed);  
  });
  
  recBtn.addEventListener("click", function(){
    if(!cam.src){
      alert("You have to select an input source first!");
      return;
    }
    
    // Remove the button when we're recording
    dlGif.classList.add("hidden");
    
    // Scale factor, never scale under 1;
    scale = Math.min(maxWidth / cam.videoWidth, 1);
    
    buffer.width = cam.videoWidth * scale;
    buffer.height = cam.videoHeight * scale;
    
    encoder = new GIFEncoder();
    encoder.setRepeat(0);
    encoder.setDelay(1000/fps);
    encoder.setSize(buffer.width, buffer.height);
    encoder.start();
    
    recStatusEl.classList.remove("hidden");
    recStatusEl.innerHTML = "Starting..."
    
    // Transfer the image every 15 secs to the canvas
    canvasStreamInterval = setInterval(captureStill, 1000/fps);    
  });
  

  // Actually capture the still.
  var captureStill = function(){
    if(collectedFrames > maxFrames){
      clearInterval(canvasStreamInterval);
      collectedFrames = 0;
      recStatusEl.innerHTML = "Finishing..."
      encoder.finish();
      // Show the button
      dlGif.classList.remove("hidden");
      recStatusEl.classList.add("hidden");
      
    } else {
      ctxB.save();
      ctxB.scale(-1, 1);
      ctxB.drawImage(cam, -1*buffer.width, 0, buffer.width, buffer.height);
      ctxB.restore();
    
      encoder.addFrame(ctxB);
      collectedFrames += 1;
      recStatusEl.innerHTML = "Frame " + collectedFrames;
    }
        
  }
  
  dlGif.addEventListener("click", function(){
    if(encoder){
      
      // Convert to something the blob can deal with as binary data
      // If we don't do this it will return encoded data as string.
      var bin = encoder.stream().bin;
      var bArr = new Uint8Array(bin.length);
      for(var i = 0; i < bin.length; i++){
        bArr[i] = bin[i];
      }

      saveData(this, new DataView(bArr.buffer), "image/gif");

    } 
  });


  
});