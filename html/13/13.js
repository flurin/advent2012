/*

Digitpaint HTML and CSS Advent 2012

                                                                                        
 _____                                  _                       ___   ____   _    _     
(_____)   ____         ____            (_)      ____  _        (___) (____) (_)_ (_)    
(_)  (_) (____)  ___  (____)  __   __  (_)_    (____)(_)__    (_)(_)(_) _(_)(___)(_)__  
(_)  (_)(_)_(_)_(___)(_)_(_) (__)_(__) (___)_ (_)_(_)(____)      (_) _ (__) (_)  (____) 
(_)__(_)(__)__(_)___ (__)__ (_) (_) (_)(_)_(_)(__)__ (_)         (_)(_)__(_)(_)_ (_) (_)
(_____)  (____)(____) (____)(_) (_) (_)(____)  (____)(_)         (_) (____)  (__)(_) (_)
                                                                                        
                                                                                        

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  


document.addEventListener("DOMContentLoaded", function(){
  var letterEl = document.getElementById("letter");
  document.getElementById("change-font-size").addEventListener("change", function(){
    letterEl.style.fontSize = this.value + "rem";
  });
  document.getElementById("change-padding").addEventListener("change", function(){
    letterEl.style.padding = this.value + "em";
  });
  
});