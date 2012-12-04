/*

Digitpaint HTML and CSS Advent 2012

  _ \                          |                  | |  |    |    
  |  |  -_)   _|   -_)   ` \    _ \   -_)   _|   __ _|  _|    \  
 ___/ \___| \__| \___| _|_|_| _.__/ \___| _|       _| \__| _| _| 
                                                                 

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  


document.addEventListener("DOMContentLoaded", function(){
  var elements = document.querySelectorAll("input[data-filter]");
  
  // Determine matchSelector function call
  var matchSelectorF = document.documentElement.mozMatchesSelector && "mozMatchesSelector" || document.documentElement.webkitMatchesSelector && "webkitMatchesSelector" || document.documentElement.matchesSelector  && "matchesSelector";
  
  // Attach event handler
  for(var i=0; i < elements.length; i++){
    var e = elements[i];
    
    var scope = function(e){
      // Find the figure node
      var figure = e;
      while(!figure[matchSelectorF]("figure.example") && figure != document.documentElement){
        figure = figure.parentNode;
      }
    
      var filterEl = figure.querySelector(".filter");
    
      e.addEventListener("change", function(ev){
        var style = e.getAttribute("data-filter");
        filterEl.style.webkitFilter = style.replace(/VAL/g, e.value);      
      });
      
    }
    
    scope(e);
  }
})


var blurHTML = function(){
  document.documentElement.style.webkitFilter = "blur(1px)";
  return false;
}