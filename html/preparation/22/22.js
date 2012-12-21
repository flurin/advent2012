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
  
  function handleDragStart(e) {
    this.style.opacity = '0.4';  // this / e.target is the source node.
    e.dataTransfer.setData("domid", this.id);
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
    }

    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
    return false;
  }

  function handleDragEnter(e) {
    // this / e.target is the current hover target.
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');  // this / e.target is previous target element.
  }
  
  function handleDrop(e) {
    // this / e.target is current target element.

    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    // See the section on the DataTransfer object.
    console.log("huh?", e.dataTransfer.getData("domid"));
    

    return false;
  }

  function handleDragEnd(e) {
    // this/e.target is the source node.
    this.style.opacity = "1";

    [].forEach.call(cols, function (col) {
      col.classList.remove('over');
    });
  }  


  var c1 = document.getElementById("container1");
  var c2 = document.getElementById("container2");  
  var cols = document.querySelectorAll('#container1 li, #container2 li');
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