/*

Digitpaint HTML and CSS Advent 2012

 ______   _______  _______  _______  _______  ______   _______  _______    __    _______ _________         
(  __  \ (  ____ \(  ____ \(  ____ \(       )(  ___ \ (  ____ \(  ____ )  /  \  (  __   )\__   __/|\     /|
| (  \  )| (    \/| (    \/| (    \/| () () || (   ) )| (    \/| (    )|  \/) ) | (  )  |   ) (   | )   ( |
| |   ) || (__    | |      | (__    | || || || (__/ / | (__    | (____)|    | | | | /   |   | |   | (___) |
| |   | ||  __)   | |      |  __)   | |(_)| ||  __ (  |  __)   |     __)    | | | (/ /) |   | |   |  ___  |
| |   ) || (      | |      | (      | |   | || (  \ \ | (      | (\ (       | | |   / | |   | |   | (   ) |
| (__/  )| (____/\| (____/\| (____/\| )   ( || )___) )| (____/\| ) \ \__  __) (_|  (__) |   | |   | )   ( |
(______/ (_______/(_______/(_______/|/     \||/ \___/ (_______/|/   \__/  \____/(_______)   )_(   |/     \|
                                                                                                           

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

document.addEventListener("DOMContentLoaded", function(){ 
  
  // Helper method to switch source.
  var switchSource = function(newSource){
    if(source){ source.disconnect(); }
    source = newSource;
    source.connect(filter1);
    source.connect(filter2);
  }

  
  var source = null;
  var aCtx = new webkitAudioContext();
  var canvas = document.getElementById("visualizer");
  canvas.height = 200;
  canvas.width = 650;
  var cCtx = canvas.getContext('2d');
  
  var audioSource = null; //We have to create a hack here because the audio element must be available first. https://code.google.com/p/chromium/issues/detail?id=112368
  var oscillatorSource = aCtx.createOscillator();
  oscillatorSource.frequency.value = 440;
  oscillatorSource.noteOn(0);
        
  // setup a analyzer
  var analyser = aCtx.createAnalyser();
  analyser.smoothingTimeConstant = 0.2;
  analyser.fftSize = 2048;  
  
  // setup a biQuadFilter filter
  var filter1 = aCtx.createBiquadFilter();
  filter1.type = filter1.ALLPASS;

  // setup a biQuadFilter filter
  var filter2 = aCtx.createBiquadFilter();
  filter2.type = filter1.ALLPASS;
  
  // Setup gain nodes
  f1Gain = aCtx.createGainNode();
  f2Gain = aCtx.createGainNode();
  
  // Connect source -> filter 1 and source -> filter 2
  // switchSource(oscillatorSource);
  
  // Immideately disconnect again (to be reconnected later)
  // source.disconnect();
  
    
  // Connect filter -> gain
  filter1.connect(f1Gain);
  
  // Connect filter -> gain
  filter2.connect(f2Gain);
  
  // Connect f1Gain + f2Gain -> analyser
  f1Gain.connect(analyser);
  f2Gain.connect(analyser);
    
  // Connect analyser -> output
  analyser.connect(aCtx.destination);
  
  var olderData = [];  
  var maxDataSize = 10;
  
  var draw = function() {

    // Create a new array that we can copy the time byte data into
    var timeByteData = new Uint8Array(analyser.frequencyBinCount);
    
    // Copy the frequency data into our new array
    analyser.getByteTimeDomainData(timeByteData);

    // Clean the canvas
    cCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    var numBins = canvas.width;
    var collectedData = new Uint8Array(numBins);
    
    // Break the samples up into bins
    var binSize = Math.floor(timeByteData.length / numBins);
    if(binSize < 1){ binSize = 1; }
    
    // Draw the current sample
    for (var i=0; i < numBins; ++i) {
      var sum = 0;
      for (var j=0; j < binSize; ++j) {
        sum += timeByteData[(i * binSize) + j];
      }

      // Calculate the average frequency of the samples in the bin
      var average = sum / binSize;
      collectedData[i] = (average / 256) * canvas.height;
      
      cCtx.fillStyle = 'rgba(255,0,0,1)';
      cCtx.fillRect(i, canvas.height - collectedData[i] + 2, 2, -2);
    }

    // Let's draw the older samples again
    for(var c=0; c < olderData.length; c++){
        var cD = olderData[c];
        for(var i=0; i < cD.length; i++){
          cCtx.fillStyle = 'rgba(0,0,0,'+ c/maxDataSize * 0.8 +')';
          cCtx.fillRect(i, canvas.height - cD[i] + 2, 1, -1);        
        }
      }
    
    // Make sure we don't accumulate more than maxDataSize older lines.
    olderData.push(collectedData);
    if(olderData.length > maxDataSize){ olderData.shift(); }

  };

  // =====================
  // = Interface setters =
  // =====================

  var setLowpassFilterValues = function(){
    if(document.getElementById("enable-lowpass-filter").checked){
      filter1.type = filter1.LOWPASS;
    } else {
      filter1.type = filter1.ALLPASS;
    }
    filter1.frequency.value = document.getElementById("lowpass-frequency").value;
    document.getElementById("lowpass-frequency-output").innerHTML = filter1.frequency.value + "Hz";
    
    f1Gain.gain.value = document.getElementById("lowpass-gain").value;
    document.getElementById("lowpass-gain-output").innerHTML = Math.round(f1Gain.gain.value * 1000)/1000;
  }
  
  var setHighpassFilterValues = function(){
    if(document.getElementById("enable-highpass-filter").checked){
      filter2.type = filter2.HIGHPASS;
    } else {
      filter2.type = filter2.ALLPASS;
    }
    filter2.frequency.value = document.getElementById("highpass-frequency").value;
    document.getElementById("highpass-frequency-output").innerHTML = filter2.frequency.value + "Hz";
    
    f2Gain.gain.value = document.getElementById("highpass-gain").value;
    document.getElementById("highpass-gain-output").innerHTML = Math.round(f2Gain.gain.value * 1000)/1000;
  }
  
  var setAudioSourceValues = function(){
    var v = document.getElementById("audio-source").value;
    var oS = document.getElementById("source-oscillator");
    var aS = document.getElementById("source-audio");
    if(v == "oscillator"){
      oS.classList.remove("hidden");
      aS.classList.add("hidden");
      switchSource(oscillatorSource);
      oscillatorSource.frequency.value = document.getElementById("oscillator-frequency").value;
      document.getElementById("oscillator-frequency-output").innerHTML = oscillatorSource.frequency.value + "Hz";
    } else {
      oS.classList.add("hidden");
      aS.classList.remove("hidden");
      if(audioSource){
        switchSource(audioSource);
      } else {
        var aEl = document.getElementById('source-audio-element');
        aEl.addEventListener("canplay", function(){
          audioSource = aCtx.createMediaElementSource(aEl);
          switchSource(audioSource);
        });
      }
    }
  }
  
  // Attach event handlers
  document.getElementById("enable-lowpass-filter").addEventListener("click", setLowpassFilterValues);
  document.getElementById("lowpass-frequency").addEventListener("change", setLowpassFilterValues);
  document.getElementById("lowpass-gain").addEventListener("change", setLowpassFilterValues);

  document.getElementById("enable-highpass-filter").addEventListener("click", setHighpassFilterValues);
  document.getElementById("highpass-frequency").addEventListener("change", setHighpassFilterValues);
  document.getElementById("highpass-gain").addEventListener("change", setHighpassFilterValues);  
  
  document.getElementById("audio-source").addEventListener("change", setAudioSourceValues);
  document.getElementById("oscillator-frequency").addEventListener("change", setAudioSourceValues);  
  
  // Call the drawing method 20 times a second
  setInterval( function () {
      webkitRequestAnimationFrame( draw );
  }, 1000 / 20 );
  
  // init
  setLowpassFilterValues();
  setHighpassFilterValues();
  setAudioSourceValues();
  
});