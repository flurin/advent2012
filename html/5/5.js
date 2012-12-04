/*

Digitpaint HTML and CSS Advent 2012

 _____                        _                    _______      _     
(____ \                      | |                  (_______)_   | |    
 _   \ \ ____ ____ ____ ____ | | _   ____  ____    ______ | |_ | | _  
| |   | / _  ) ___) _  )    \| || \ / _  )/ ___)  (_____ \|  _)| || \ 
| |__/ ( (/ ( (___ (/ /| | | | |_) ) (/ /| |       _____) ) |__| | | |
|_____/ \____)____)____)_|_|_|____/ \____)_|      (______/ \___)_| |_|
                                                                      

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  


document.addEventListener("DOMContentLoaded", function(){
  var container = document.getElementById("columns");
  
  // A little helper method that removes all options as class names
  // from the .classList (this is seriously awesome btw, no more js lib needed for this!)
  // and adds the currently selected option as class.
  var setSelectedClassName = function(select){
    var options = select.querySelectorAll("option");
    for(var i=0; i < options.length; i++){
      container.classList.remove(options[i].getAttribute("value"));
    }
    
    container.classList.add(select.value);    
  }
  
  document.getElementById("column-count-modifier").addEventListener("change", function(ev){
    var select = ev.target;
    
    setSelectedClassName(select);
  });
  
  document.getElementById("column-fill-modifier").addEventListener("change", function(ev){
    var select = ev.target;
    setSelectedClassName(select);
  });  
  
});