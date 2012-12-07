/*

Digitpaint HTML and CSS Advent 2012

 #######                                       ##                        ####    ##   ##     
/##////##                                     /##                       #/// #  /##  /##     
/##    /##  #####   #####   #####  ########## /##       #####  ######  /#   /# ######/##     
/##    /## ##///## ##///## ##///##//##//##//##/######  ##///##//##//#  / #### ///##/ /###### 
/##    /##/#######/##  // /####### /## /## /##/##///##/####### /## /    #/// #  /##  /##///##
/##    ## /##//// /##   ##/##////  /## /## /##/##  /##/##////  /##     /#   /#  /##  /##  /##
/#######  //######//##### //###### ### /## /##/###### //######/###     / ####   //## /##  /##
///////    //////  /////   ////// ///  //  // /////    ////// ///       ////     //  //   // 

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

!function(){
  var t = null, becameHiddenAt = null, hiddenSeconds = 0;
          
  document.addEventListener("webkitvisibilitychange", function(){
    var state = document.webkitVisibilityState;
    if(state == "visible"){
      // We just became visible
      hiddenSeconds += ((new Date()) - becameHiddenAt) / 1000
      
      t.innerHTML = "You now had this tab in the background for: "+formatSeconds(hiddenSeconds)+". You switched tabs around "+ becameHiddenAt;
      
      becameHiddenAt = null;
      
    } else if(state == "hidden"){
      // We just got hidden
      becameHiddenAt = new Date();
    } else{
      console.log(state);
    }
  })

  // Helper function to format seconds in to time format: HH:mm:ss
  var formatSeconds = function(seconds){
    if(seconds == Infinity){ return "infinity"; }
    
    var secondsLeft = Math.abs(seconds);
    var time = [];
    time.push(Math.floor(secondsLeft/3600));
    secondsLeft = secondsLeft % 3600
    time.push(Math.floor(secondsLeft/60));
    time.push(Math.round(secondsLeft % 60));
    return time.map(function(v){ return v < 10 ? "0" + v : "" + v}).join(":");
  }

  document.addEventListener("DOMContentLoaded", function(){
    t = document.getElementById("active-timer");
  });  
}();
