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
  // Find the right method, call on correct element
  function launchFullScreen(element) {
    if(element.requestFullScreen) {
      element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
  }
  
  function cancelFullScreen(){
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }  
  }

  document.getElementById("make-fullscreen").addEventListener("click", function(){
    // Launch fullscreen for browsers that support it!
    launchFullScreen(document.getElementById("fullscreen")); // any individual element    
  });
  
  document.getElementById("make-page-fullscreen").addEventListener("click", function(){
    launchFullScreen(document.documentElement); // any individual element        
  });
  
  
  
  document.getElementById("cancel-fullscreen").addEventListener("click", function(){
    cancelFullScreen();
  });
  
  document.addEventListener("webkitfullscreenchange", function(){
    console.log("Yeah something changed", document.webkitFullscreenElement);
  })
  
});