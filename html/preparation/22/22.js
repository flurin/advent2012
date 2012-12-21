/*

Digitpaint HTML and CSS Advent 2012

888 88e                                        888                       ,8,"88e  ,8,"88e               888 
888 888b   ,e e,   e88'888  ,e e,  888 888 8e  888 88e   ,e e,  888,8,    "  888D  "  888D 888 8e   e88 888 
888 8888D d88 88b d888  '8 d88 88b 888 888 88b 888 888b d88 88b 888 "        88P      88P  888 88b d888 888 
888 888P  888   , Y888   , 888   , 888 888 888 888 888P 888   , 888         ,*"      ,*"   888 888 Y888 888 
888 88"    "YeeP"  "88,e8'  "YeeP" 888 888 888 888 88"   "YeeP" 888       8888888  8888888 888 888  "88 888 
                                                                                                            
                                                                                                            

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

document.addEventListener("DOMContentLoaded", function(){
  var lastEnter = null;
  
  
  var handleDragStart = function(e) {
    this.style.opacity = '0.4';  // this / e.target is the source node.
    
    // This is for internal use only
    e.dataTransfer.setData("domid", this.id);
    
    // If you drag this out there we add the category too.
    var category = this.parentNode.previousElementSibling.innerText;
    e.dataTransfer.setData("text/plain", category + " : " + this.innerText);
    e.dataTransfer.setData("text/html", "<strong>" + category + "</strong> : " + this.innerHTML);    

  }

  var handleDragOver = function(e) {
    e.preventDefault(); // Necessary. Allows us to drop.

    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
    
    // Hack to counter handleDragLeave being called when entering child nodes.
    this.classList.add('over');
    return false;
  }

  var handleDragEnter = function(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }    
    // this / e.target is the current hover target.
    this.classList.add('over');
  }

  var handleDragLeave = function(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); 
    }
    
    this.classList.remove('over');
  }
  
  var handleDrop = function(e) {
    // this / e.target is current target element.

    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }
    e.preventDefault();

    // See the section on the DataTransfer object.
    var domId = e.dataTransfer.getData("domid");
    var el;
    
    // if(e.dataTransfer.types && e.dataTransfer.types.length > 0){
    //   for(var i=0; i < e.dataTransfer.types.length; i++){
    //     console.log(e.dataTransfer.types[i], e.dataTransfer.getData(e.dataTransfer.types[i]));        
    //   }
    // }
    
    if(domId){
      el = document.getElementById(e.dataTransfer.getData("domid"));
      this.appendChild(el);
    } else {

      if(e.dataTransfer.files.length > 0){
        for(var i=0; i < e.dataTransfer.files.length; i++){
          el = createChild(e.dataTransfer.files[i].name);
          this.appendChild(el);
        }
      } else {
        el = createChild(e.dataTransfer.getData(e.dataTransfer.types && e.dataTransfer.types[0] || "Text"));
        this.appendChild(el);
      }
    }
    
    // Cleanup (this shouldn't have to be done but well...)
    this.classList.remove("over");

    return false;
  }

  var handleDragEnd = function(e) {
    // this/e.target is the source node.
    this.style.opacity = "1";

    [c1,c2].forEach(function (container) {
      container.classList.remove('over');
    });
    
  }  
  
  var createChild = function(content){
    var el = document.createElement("li");
    el.id = "col-" + cols.length;
    el.setAttribute("draggable", true);
    el.innerHTML = content;
    el.addEventListener('dragstart', handleDragStart, false);
    el.addEventListener('dragend', handleDragEnd, false);    
    
    cols.push(el);
    return el;
  }


  var c1 = document.getElementById("container1");
  var c2 = document.getElementById("container2");  
  var cols = [].slice.call(document.querySelectorAll('#container1 li, #container2 li'));
  for(var i=0; i < cols.length; i++){
    var col = cols[i];
    var id = "col-" + i;
    col.id = id;
    col.addEventListener('dragstart', handleDragStart, false);
    col.addEventListener('dragend', handleDragEnd, false);    
  };  

  [c1, c2].forEach(function(container){
    container.addEventListener('dragenter', handleDragEnter, false);
    container.addEventListener('dragleave', handleDragLeave, false);
    container.addEventListener('drop', handleDrop, false);
    container.addEventListener('dragover', handleDragOver, false);
    
  })
  
});