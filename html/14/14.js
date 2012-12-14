/*

Digitpaint HTML and CSS Advent 2012

    ____                           __                 _____ __  __  __  
   / __ \___  ________  ____ ___  / /_  ___  _____   <  / // / / /_/ /_ 
  / / / / _ \/ ___/ _ \/ __ `__ \/ __ \/ _ \/ ___/   / / // /_/ __/ __ \
 / /_/ /  __/ /__/  __/ / / / / / /_/ /  __/ /      / /__  __/ /_/ / / /
/_____/\___/\___/\___/_/ /_/ /_/_.___/\___/_/      /_/  /_/  \__/_/ /_/ 
                                                                        

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  


document.addEventListener("DOMContentLoaded", function(){
  
  var bwTextEl = document.getElementById("bandwith-text");
  var statusTextEl = document.getElementById("online-status-text");
  var statusImgEl = document.getElementById("online-status-img");

  var bandwidth = 1;
  
  var setStatus = function(online){
    if(online){
      setBandwidth(1);
      statusTextEl.innerHTML = "Online";
      statusImgEl.src = "images/online.svg";      
    } else {
      setBandwidth(0);
      statusTextEl.innerHTML = "Offline";
      statusImgEl.src = "images/offline.svg";       
    }
  };
  
  var setBandwidth = function(v){
    if(v == Infinity){
      bandwidth = 1;
    } else {
      bandwidth = v;
    }
  }  
  
  window.addEventListener("online", function(){
    setStatus(true);
  });
  
  window.addEventListener("offline", function(){
    setStatus(false);   
  });
  
  // The connection, may not be available
  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if(connection){
    setBandwidth(connection.bandwith);
    connection.addEventListener("change", function(){
      setBandwidth(connection.bandwith);
      if(connection.bandwidth < Infinity){
        bwTextEl.innerHTML = connection.bandwith + "Mb/s";
      } else {
        bwTextEl.innerHTML = "Unknown";
      }
    });
  }
  
  // Preload images so they work in offline mode (we can't really fetch them then...)
  var img = new Image();
  img.src = "images/online.svg";
  img.src = "images/offline.svg";
  
  // Set initial status;
  setStatus(navigator.onLine);
  
  // =====================
  // = Drawing the graph =
  // =====================
  
  var canvas = document.getElementById("online-graph");
  var ctx = canvas.getContext("2d");
  canvas.width = 520;
  var fps = 3;
  var lastTick = new Date();
  var showWindow = 300 // Number of seconds to show
  var data = [];  
  var pxPerW = canvas.width / showWindow;
  
  var calcBarHeight = function(h, max){
    if(h > 0){
      return h * (canvas.height / max);
    } else {
      return (canvas.height / max);
    }    
  }
  
  var draw = function(){
    data.push(bandwidth);
    
    if(data.length > showWindow){
      data.shift();
    }
    
    var max = Math.max(Math.max.apply( Math, data ), 50);
    var x,y, h;
    
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.font = "10px/1.2em Verdana";
    
    for(var i=0; i < data.length; i++){
      h = calcBarHeight(data[i], max);
      
      x = canvas.width - ((data.length - i) * pxPerW);
      y = (canvas.height / 2)  - h/2;
      
      if((data[i] == 0 && data[i+1] > 0) || (data[i] > 0 && data[i+1] === 0)){
        ctx.save();
        ctx.fillStyle = "black";
        
        if(data[i+1] > 0){
          ctx.fillText("Online", x, y - calcBarHeight(data[i+1], max)/2);
        } else {
          ctx.fillText("Offline", x, y + calcBarHeight(data[i+1], max)/2 + 1.2*10);
        }
        
        ctx.restore();

        // We draw a dransparent 1px line if we changed state        
        ctx.fillStyle = "transparent";
        
      } else {
        if(data[i] > 0){
          ctx.fillStyle = "green";
        } else {
          ctx.fillStyle = "red";
        }        
      }
      
      ctx.fillRect(x, y, pxPerW, h);
    }
  };
  
  var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
  
  // Call the drawing method X times a second
  setInterval( function () {
    if(requestAnimationFrame){
      requestAnimationFrame( draw );
    } else {
      draw();
    }
  }, 1000 / fps );
  
});