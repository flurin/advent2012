/*

Digitpaint HTML and CSS Advent 2012

________                            ___.                  ________            .___
\______ \   ____  ____  ____   _____\_ |__   ___________  \_____  \  ____   __| _/
 |    |  \_/ __ \/ ___\/ __ \ /     \| __ \_/ __ \_  __ \  /  ____/ /    \ / __ | 
 |    `   \  ___\  \___  ___/|  Y Y  \ \_\ \  ___/|  | \/ /       \|   |  \ /_/ | 
/_______  /\___  >___  >___  >__|_|  /___  /\___  >__|    \_______ \___|  \____ | 
        \/     \/    \/    \/      \/    \/     \/                \/    \/     \/ 

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

document.addEventListener("DOMContentLoaded", function () {

  // ===============
  // = EventSource =
  // ===============
            
  var initEventSource = function(){        
    // Open a new EventSource (does not work cross-domain)
    var source = new EventSource("/eventserver/loadavg");
      
    // Listen to the "open" event; we log every time the browser
    // creates a new connection
    source.addEventListener("open", function(){
      if(window.console && window.console.log){
          console.log("Connection opened");
      }
    }, false)
      
    // Listen to the "error" event; we log every time the connection
    // is being closed on us by the other side.
    source.addEventListener('error', function(e) {
      if (e.readyState == EventSource.CLOSED) {
        if(window.console && window.console.log){
          console.log("Connection closed");
        }
      }
    }, false);      
      
    // Listen to the message event. This is where the magic happens!
    // Every time the server sends a message, this event is triggered
    source.addEventListener('message', function(e) {
      console.log(e);
      // We get the load averages in a JSON array 
      // so we have to parse the data here.
      var loadAvg = JSON.parse(e.data);
          
      // Update the plot with our new Data
      updatePlot(loadAvg);

    }, false);              
  }
      
  // ===============
  // = Chart stuff =
  // ===============
      
  // Setup data containers for the 3 load averages
  // Also specify the total number of points we want in the graph before discarding data
  var data1 = {
    "label" : "1 min",
    "data": []
  }, 
  data5 = {
    "label" : "5 min",
    "data" : []    
  }, 
  data15 = {
    "label" : "15 min",
    "data" : []
  }, 
  totalPoints = 100;
  
  // Populate data
  for(var i=0; i < totalPoints; i++){
    data1["data"].push(null);
    data5["data"].push(null);
    data15["data"].push(null);    
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
  var updatePlot = function(loadAvg){
    // Push each value of the array into the respective
    // data object. 
    addData(loadAvg[0] * 1, data1);
    addData(loadAvg[1] * 1, data5);
    addData(loadAvg[2] * 1, data15);
                    
    // Set our newly received data and plot it!
    plot.setData(buildPlotData());
    plot.setupGrid();
    plot.draw();        
  }
      
  // Build plot data for all three data elements with X and Y values
  var buildPlotData = function(){
    var plotData = [data1, data5, data15];
        
    // Create output that can be read by the plot.
    // zip the generated y values with the x values
    var zipData = function(data){
      var res = [];
      for (var i = 0; i < data["data"].length; ++i)
          res.push([i, data["data"][i]])
      return {"label" : data["label"], data: res};          
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
    xaxis: { 
      show: false 
    },
    yaxis: {
      min: 0
    },
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
  var plot = $.plot($("#loadavg-chart"), buildPlotData(), options);
      
  // Initialize our eventSource object
  initEventSource();
});