/*

Digitpaint HTML and CSS Advent 2012

                                                             
,--.                     |                   '|,--.|    |    
|   |,---.,---.,---.,-.-.|---.,---.,---.      ||--.|--- |---.
|   ||---'|    |---'| | ||   ||---'|          ||  ||    |   |
`--' `---'`---'`---'` ' '`---'`---'`          ``--'`---'`   '
                                                             

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

document.addEventListener("DOMContentLoaded", function(){
  
  plane = document.getElementById("plane");
  
  var tiltLR, tiltFB, dir;
  var lTiltLR, lTiltFB, lDir;  
  var change;
  
  var devOrientHandler = function(eventData){

    if(eventData.gamma === null){
      noSupport("Sorry, your browser/device does not seem to send sensible orientation data.");
      return;
    }
    
    var dx, dy //Actual rotation value
        
    // gamma is the left-to-right tilt in degrees, where right is positive
    tiltLR = eventData.gamma;

    // beta is the front-to-back tilt in degrees, where front is positive
    tiltFB = eventData.beta;

    // alpha is the compass direction the device is facing in degrees
    dir = eventData.alpha;
        
    // Compensate for device roration
    if(window.orientation !== undefined){
      var orient = window.orientation, dx, dy;
      if (!orient || orient === 0) { // normal portrait orientation
        dx = tiltLR;
        dy = tiltFB;
      } else if (orient === -90) { // landscape, rotated clockwise
        dx = -1 * tiltFB;
        dy = tiltLR;
      } else if (orient === 90) { // landscape, rotated counterclockwise
        dx = tiltFB;
        dy = -1 * tiltLR;
      } else if (orient === 180) { // portrait, upside down
        dx = -1 * tiltLR;
        dy = -1 * tiltFB;
      }
      
      tiltLR = dx;
      tiltFB = dy;
    }
        
    // Only detect changes greater than 1 degree
    var change = false;
    if(Math.abs(tiltLR - lTiltLR) > 1){
      change = true;
    }

    if(Math.abs(tiltFB - lTiltFB) > 1){
      change = true;          
    }

    if(Math.abs(dir - lDir) > 1){
      change = true;          
    }    
    
    if(change){
      plane.style.webkitTransform = "rotateX("+tiltFB+"deg) rotateY("+tiltLR+"deg)  rotateZ("+dir+"deg)";
      plane.style.mozTransform = "rotateX("+tiltFB+"deg) rotateY("+tiltLR+"deg)  rotateZ("+dir+"deg)";      
      plane.style.transform = "rotateX("+tiltLR+"deg) rotateY("+tiltFB+"deg)  rotateZ("+dir+"deg)";      
      
      setTimeout(function(){updatePlot(tiltLR, tiltFB, dir)}, 0);
    }
    
    lTiltLR = tiltLR;
    lTiltFB = tiltFB;
    lDir = dir;    
  }
  
  var noSupport = function(msg){
    var el = document.getElementById("rotator");
    el.innerHTML = msg;
    el.className = "no-support"
  }
  
  if (window.DeviceOrientationEvent) {
    // Listen for the deviceorientation event and handle DeviceOrientationEvent object
    window.addEventListener('deviceorientation', devOrientHandler, false);
  } else {
    noSupport("Sorry, your browser/device does not seem to support deviceorientation event.");
  }
  
  // ===============
  // = Chart stuff =
  // ===============
      
  // Setup data containers for the 3 load averages
  // Also specify the total number of points we want in the graph before discarding data
  var dataLR = {
    "label" : "Tilt left-right",
    "data": [],
    "yaxis" : 1
  }, 
  dataFB = {
    "label" : "Tilt front-back",
    "data" : [],
    "yaxis" : 1
  }, 
  dataDir = {
    "label" : "Direction",
    "data" : [],
    "yaxis" : 2
  }, 
  totalPoints = 100;
  
  // Populate data
  for(var i=0; i < totalPoints; i++){
    dataLR["data"].push(null);
    dataFB["data"].push(null);
    dataDir["data"].push(null);    
  }
      
  // This function adds value to a data array
  var addData = function(value, data) {
        
      // If we got more than totalPoints, we're going to discard older data
      if (data["data"].length >= totalPoints){
        data["data"].shift();
      }
          
      // Add the value to data
      data["data"].push(value);          
  }
      
  // Render newly received loadAvg data.
  var updatePlot = function(tiltLR, tiltFB, dir){
    // Push each value of the array into the respective
    // data object. 
    addData(tiltLR, dataLR);
    addData(tiltFB, dataFB);
    addData(dir, dataDir);
                    
    // Set our newly received data and plot it!
    plot.setData(buildPlotData());
    plot.setupGrid();
    plot.draw();        
  }
      
  // Build plot data for all three data elements with X and Y values
  var buildPlotData = function(){
    var plotData = [dataLR, dataFB, dataDir];
        
    // Create output that can be read by the plot.
    // zip the generated y values with the x values
    var zipData = function(data){
      var res = [];
      for (var i = 0; i < data["data"].length; ++i)
          res.push([i, data["data"][i]])
      return {"label" : data["label"], "yaxis": data["yaxis"], data: res};          
    }
        
    return plotData.map(zipData);
  }
      
  // ==================
  // = Initialisation =
  // ==================
      
  // Setup the Flot chart
  var options = {
    series: { 
      shadowSize: 0 // drawing is faster without shadows
    }, 
    xaxes: [{ 
      show: false 
    }],
    yaxes: [
      {
        min: -180,
        max: 180
      },
      {
        min: 0,
        max: 360,
        position: "right"
      }            
    ],
    grid: {
      backgroundColor: "#fff"
    },
    legend: {
      backgroundColor: "transparent",
      show: true,
      noColumns: 1,
      position: "sw"
    }
  };
      
  // Actually put the plot in the container
  var plot = $.plot($("#orientation-chart"), buildPlotData(), options);
  
});