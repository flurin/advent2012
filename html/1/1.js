/*

Digitpaint HTML and CSS Advent 2012

o-o                      o                  0        o  
|  \                     |                 /|        |  
|   O o-o  o-o o-o o-O-o O-o  o-o o-o     o |   o-o -o- 
|  /  |-' |    |-' | | | |  | |-' |         |    \   |  
o-o   o-o  o-o o-o o o o o-o  o-o o       o-o-o o-o  o  
                                                        
                                                        

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  


document.addEventListener('DOMContentLoaded', function(){

  // =================================
  // = Wrapper to show notifications =
  // =================================
    
  var displayNotification;

  // Legacy webkit notifications
  if(window.webkitNotifications){
    // Function to actually display the notification
    displayNotification = function(icon, title, content){
      // Check to see if we have permission to create notifications
      if (window.webkitNotifications.checkPermission() == 0) { // 0 is PERMISSION_ALLOWED
      
        // Create the notification object
        var notification = window.webkitNotifications.createNotification(icon, title, content);
      
        // Attach event listeners
        notification.addEventListener("close", function(){ 
          if(window.console && window.console.log){
            console.log("You closed the notification!" );
          }
        });
        notification.addEventListener("click", function(){ 
          if(window.console && window.console.log){
            console.log("You clicked the notification!" );
          }
        });
            

        // Show the notification
        notification.show();
      } else {
        // Request permission to show the notifications first
        window.webkitNotifications.requestPermission(function(){
          // Call myself again
          if (window.webkitNotifications.checkPermission() == 0){
              displayNotification(icon, title, content);
          }
        });
      }
    }
  } 
  // W3C Notifications
  else if (window.Notification){
    // Function to actually display the notification
    displayNotification = function(icon, title, content){
      if (Notification.permissionLevel() === "granted") {
        
        // Create the notification object
        var notification = new Notification(title, {
          iconUrl: icon, 
          body: content
        });
        
        // Attach event listeners
        notification.addEventListener("close", function(){ 
          if(window.console && window.console.log){
            console.log("You closed the notification!" );
          }
        });
        notification.addEventListener("click", function(){ 
          if(window.console && window.console.log){
            console.log("You clicked the notification!" );
          }
        });
        
        // Show the notification
        notification.show();
      } else if (Notification.permissionLevel() === "default") {
        Notification.requestPermission(function () {
          displayNotification(icon, title, content);
        });
      }      
    }    
  }
  
  
  // ========================
  // = Simple notifications =
  // ========================
  
  if(displayNotification){
    var oneButton = document.getElementById("one-notification");
    // Attach the onclick handler
    oneButton.addEventListener("click", function(){
      displayNotification("/favicon.ico", "Title", "Body");
    });    
  }
  
  // ==========================
  // = Multiple notifications =
  // ==========================
  
  if(displayNotification){
    var startButton = document.getElementById("start-multiple-notification");
    var stopButton = document.getElementById("stop-multiple-notification");    
    var count = 0;
    var timer = null;
    
    var counterNotifications = function(){
      count += 1;
      displayNotification("/favicon.ico", "Title " + count, "Body");
    }
    
    // Attach the onclick handler
    startButton.addEventListener("click", function(){
      timer = setInterval(counterNotifications, 5000);
    });    
    
    stopButton.addEventListener("click", function(){
      clearInterval(timer);
    });      
  }
  
}, false)

