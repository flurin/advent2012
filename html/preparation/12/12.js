/*

Digitpaint HTML and CSS Advent 2012

  ______                                  __                    _____  _______  __    __    
 |   _  \  .-----..----..-----..--------.|  |--..-----..----.  | _   ||       ||  |_ |  |--.
 |.  |   \ |  -__||  __||  -__||        ||  _  ||  -__||   _|  |.|   ||___|   ||   _||     |
 |.  |    \|_____||____||_____||__|__|__||_____||_____||__|    `-|.  | /  ___/ |____||__|__|
 |:  1    /                                                      |:  ||:  1  \              
 |::.. . /                                                       |::.||::.. . |             
 `------'                                                        `---'`-------'             
                                                                                            

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

document.addEventListener("DOMContentLoaded", function(){
  navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia;
  window.URL = window.webkitURL ||  window.URL;
  
  var cam = document.getElementById("cam");
  
  // Prepare the buffer
  var buffer = document.createElement("canvas");
  var ctxB = buffer.getContext("2d");
  
  
});