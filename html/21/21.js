/*

Digitpaint HTML and CSS Advent 2012

 ____                                     __                            ___       _          __      
/\  _`\                                  /\ \                         /'___`\   /' \        /\ \__   
\ \ \/\ \     __    ___     __    ___ ___\ \ \____     __  _ __      /\_\ /\ \ /\_, \    ____\ \ ,_\  
 \ \ \ \ \  /'__`\ /'___\ /'__`\/' __` __`\ \ '__`\  /'__`\/\`'__\    \/_/// /__\/_/\ \  /',__\ \ \/  
  \ \ \_\ \/\  __//\ \__//\  __//\ \/\ \/\ \ \ \L\ \/\  __/\ \ \/        // /_\ \  \ \ \/\__, `\ \ \_ 
   \ \____/\ \____\ \____\ \____\ \_\ \_\ \_\ \_,__/\ \____\ \_\       /\______/   \ \_\/\____/\ \__\
    \/___/  \/____/\/____/\/____/\/_/\/_/\/_/\/___/  \/____/\/_/       \/_____/     \/_/\/___/  \/__/
                                                                                                     
                                                                                                     

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  


document.addEventListener("DOMContentLoaded", function(){
  
  var containerEl = document.getElementById("container");
  var floatEl = document.getElementById("float1");
  var demoImageEl = null;
  
  var selWF = document.getElementById("wrap-flow");
  var selL = document.getElementById("content-layout");  
  var selWT = document.getElementById("wrap-through");
  
  // Helper function to set the class name based on the select box
  // Not the most efficient code but works fine on smaller sets.
  var setClassFromSelect = function(select, el){
    var options = select.querySelectorAll("option");
    
    for(var i=0; i < options.length; i++){
      el.classList.remove(options[i].getAttribute("value"));
    }
    
    el.classList.add(select.value);    
  }
  
  var setDemoImage = function(){
    var cl = containerEl.className + " " + floatEl.className;
    cl = cl.replace("hidden", "");

    if(!demoImageEl){
      demoImageEl = new Image();
      demoImageEl.className = "demo";
      containerEl.parentNode.insertBefore(demoImageEl, containerEl.nextSibling);
    }
    
    console.log(cl.split(/\s+/).join("_") + ".jpg");
    
    demoImageEl.src = "images/screenshots/" + cl.split(/\s+/).join("_") + ".jpg";
  }
  
  // =======================
  // = Add event listeners =
  // =======================
  
  selWF.addEventListener("change", function(){
    setClassFromSelect(this, floatEl);
    if(!Modernizr.wrapflow){
      setDemoImage();
    }
  });

  selL.addEventListener("change", function(){
    setClassFromSelect(this, container);
    if(!Modernizr.wrapflow){
      setDemoImage();      
    }
  });
  
  if(Modernizr.wrapflow){
    selWT.addEventListener("click", function(){
      if(this.checked){
        containerEl.classList.add("wrap-through");      
      } else {
        containerEl.classList.remove("wrap-through");
      }
    })
  } else {
    selWT.disabled = true;
    containerEl.parentNode.classList.add("no-support");
    setDemoImage();
  }
    
  // ==========================
  // = Let the float be moved =
  // ==========================
  
  var startMouse = {x: 0, y: 0};
  var startElement = {x: 0, y: 0};
  var moving = false;
  
  document.addEventListener("mousedown", function(e){
    var target = e.target;
    if(target == floatEl){
      startMouse.x = e.clientX;
      startMouse.y = e.clientY;
      
      startElement.x = target.offsetLeft;
      startElement.y = target.offsetTop;
      
      moving = true;
      
      document.addEventListener("mousemove", floatMove, false);
    }
    
  }, false);
  
  document.addEventListener("mouseup", function(e){
    if(moving){
      document.removeEventListener("mousemove", floatMove);

      moving = false;
    }
    
  }, false);

  floatEl.addEventListener("dragstart", function(e){ e.preventDefault(); }, false)

  var floatMove = function(e){
    var x = startElement.x + e.clientX - startMouse.x;
    var y = startElement.y + e.clientY - startMouse.y;    
    
    if(x < 0){ x = 0; }
    if(y < 0){ y = 0; }
    
    if(x > container.offsetWidth - floatEl.offsetWidth){ x = container.offsetWidth - floatEl.offsetWidth; }
    if(y > container.offsetHeight - floatEl.offsetHeight){ y = container.offsetHeight - floatEl.offsetHeight; }    
    
    
    floatEl.style.left = x + "px";
    floatEl.style.top = y + "px";    
    
  }
  
  
});



// CSS Exclusions (wrap-flow support)
// http://www.w3.org/TR/css3-exclusions/
// By: Flurin Egger

// Based on the Regions support code

// We start with a CSS parser test then we check page geometry to see if it's affected by exclusions
// Later we might be able to retire the second part, as WebKit builds with the false positives die out

Modernizr.addTest('wrapflow', function() {

	/* Get the 'wrapFlow' property name available in the browser. Either default or vendor prefixed.
	If the property name can't be found we'll get Boolean 'false' and fail quickly */
	var wrapFlowProperty = Modernizr.prefixed("wrapFlow");

	if (!wrapFlowProperty){
		return false;
	}

	/* If CSS parsing is there, try to determine if exclusions actually work. */
	var container		= document.createElement('div'),
		content			= document.createElement('div'),
		exclusion		= document.createElement('div');

	/* First create a div with two adjacent divs inside it. The first will be the
	content, the second will be the region. To be able to distinguish between the two,
	we'll give the region a particular padding */
	content.innerText		= 'Test';
	container.style.cssText	= 'position: relative';
	exclusion.style.cssText	= 'width: 50px; height: 50px; left: 0; top: 0; position: absolute;';

	exclusion.style[wrapFlowProperty] = "auto";
	container.appendChild(content);
	container.appendChild(exclusion);
	document.documentElement.appendChild(container);

	/* Now compute the bounding client rect, before and after attempting to set 
   wrapFlow to clear. If this succeeds the box will not allow any content
   next to it and the container should have become bigger .*/
	var wrappedRect, delta,
		plainRect = content.getBoundingClientRect();

	exclusion.style[wrapFlowProperty] = "clear";
	wrappedRect = content.getBoundingClientRect();

	delta = wrappedRect.height - plainRect.height;
  
  // Cleanup
  document.documentElement.removeChild(container);
  content = exclusion = container = undefined;

	return (delta > 0);
});

