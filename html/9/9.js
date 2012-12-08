/*

Digitpaint HTML and CSS Advent 2012

  ____                          _                  ___  _   _     
 |  _ \  ___  ___ ___ _ __ ___ | |__   ___ _ __   / _ \| |_| |__  
 | | | |/ _ \/ __/ _ \ '_ ` _ \| '_ \ / _ \ '__| | (_) | __| '_ \ 
 | |_| |  __/ (__  __/ | | | | | |_) |  __/ |     \__, | |_| | | |
 |____/ \___|\___\___|_| |_| |_|_.__/ \___|_|       /_/ \__|_| |_|
                                                                  

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

document.addEventListener("DOMContentLoaded", function(){
  
  // Normalize for vendor prefixes  
  var requestFullScreen = function(element) {
    if(element.requestFullScreen) {
      element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
  }
  
  var cancelFullScreen = function(){
    if (document.cancelFullScreen) {
      return document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      return document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      return document.webkitCancelFullScreen();
    }      
  }
  
  // Normalize for vendor prefixes, return event, and fullscreen Element name
  var methods = (function(){
    if (document.cancelFullScreen) {
      return ["fullscreenchange", "fullscreenElement"];
    } else if (document.mozCancelFullScreen) {
      return ["mozfullscreenchange", "mozFullscreenElement"];
    } else if (document.webkitCancelFullScreen) {
      return ["webkitfullscreenchange", "webkitFullscreenElement"];
    }  
  })();
  
  var fullscreenchange = methods[0];
  var fullscreenElement = methods[1];
  
  // Make the div#fullscreen go fullscreen
  document.getElementById("make-div-fullscreen").addEventListener("click", function(){
    requestFullScreen(document.getElementById("fullscreen"));
  });
  
  // Make the documentElement (whole page) go fullscreen
  document.getElementById("make-page-fullscreen").addEventListener("click", function(){
    requestFullScreen(document.documentElement);
  });  
  
  // Cancel any fullscreen action
  document.getElementById("cancel-fullscreen").addEventListener("click", function(){
    cancelFullScreen();
  });
  
  // Do something if we go into fullscreen mode
  document.addEventListener(fullscreenchange, function(){
    if(window.console && window.console.log){
      if(document[fullscreenElement]){
        // We have a fullscreenElement so we must be in fullscreen mode        
        console.log("Fullscreen mode on, with element:", document[fullscreenElement]);
      } else {
        // Exit fullcsreen
        console.log("Fullscreen mode off");
      }
    }
  })
    
});