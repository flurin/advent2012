/*

Digitpaint HTML and CSS Advent 2012

 #####                                        #                                      #      ####      #      #       
 #    #                                       #                                     ##     #    #     #      #       
 #     #   #####    #####    #####   ### ##   ######    #####    # ###               #     #    #   ######   ######  
 #     #  #     #  #        #     #  #  #  #  #     #  #     #   ##                  #      #####     #      #     # 
 #     #  #######  #        #######  #  #  #  #     #  #######   #                   #          #     #      #     # 
 #    #   #        #        #        #  #  #  #     #  #         #                   #         #      #      #     # 
 #####     #####    #####    #####   #     #  ######    #####    #                   #      ###        ###   #     # 
                                                                                                                     

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

document.addEventListener("DOMContentLoaded", function(){
  
  var iframe = document.getElementById("region-source");
  var container = document.querySelector(".container");
  
  var semicircle = function(){
    if(!container.classList.contains("formation1")){
      var regions = container.querySelectorAll(".region");
      for(var i=0; i < regions.length; i++){
        var reg = regions[i]
        reg.style.transform = "";
        reg.style.webkitTransform = "";
        reg.style.mozTransform = "";
      }
      return;       
    }
    
    var r = null, 
        a = container.offsetWidth,
        x = 50,
        deg = 0, 
        degStart = 0;
  
    r = (Math.pow(a,2) + 4 * Math.pow(x,2)) / (8 * x);
  
    deg = Math.acos((r - x) / r) * 180/Math.PI * 2;
    
    var regions = container.querySelectorAll(".region");
  
    degStart = 0 - deg/2;
    portion = deg / (regions.length -1);
  
    for(var i=0; i < regions.length; i++){
      var reg = regions[i]

      reg.style.mozTransformOrigin = "50% " + r + "px";
      reg.style.mozTransform = "rotate("+ (degStart + i * portion) +"deg)";

      reg.style.webkitTransformOrigin = "50% " + r + "px";
      reg.style.webkitTransform = "rotate("+ (degStart + i * portion) +"deg)";
    
      reg.style.transformOrigin = "50% " + r + "px";
      reg.style.transform = "rotate("+ (degStart + i * portion) +"deg)";
    }    
  }

  var detectMsFlow = function() {
  	var d = document.createElement("detect");
    if (d.style["msFlowInto"] === "") return true;
    return false;
  };  

  document.getElementById("add-text").addEventListener("click", function(){
    var string = "Moar text in a new paragraph!";
    iframe.contentWindow.postMessage(["addText", string], "*");
    
    var p = document.createElement("p");
    p.innerHTML = string;
    var rs = document.getElementById("region-source2");
    rs.insertBefore(p, rs.firstChild);    
  })
  
  document.getElementById("add-region").addEventListener("click", function(){
    var regions = document.querySelectorAll(".container .region");
    if(regions.length <= 6){
      var region = document.createElement("div");
      region.className = "region";
      container.appendChild(region);
      semicircle();
      if(regions.length >= 5){
        this.disabled = true;
      }
    }
  })
  
  document.getElementById("change-formation").addEventListener("change", function(){
    container.className = "container " + this.value;
    semicircle();
  });
  
  window.addEventListener("resize", semicircle);
  
  if(!Modernizr.regions && !detectMsFlow()){
    container.innerHTML = "Sorry, you need IE10, Webkit nightly or Chrome Canary (with experimental WebKit features enabled) to see this example...";
    container.parentNode.classList.add("no-support");
  }
  
  if(detectMsFlow()){
    document.getElementById("region-source2").className = "hidden";
  } 
  
  if(Modernizr.regions) {
    document.getElementById("region-source").className = "hidden";
  }
  
});


// We start with a CSS parser test then we check page geometry to see if it's affected by regions
// Later we might be able to retire the second part, as WebKit builds with the false positives die out

Modernizr.addTest('regions', function() {

	/* Get the 'flowFrom' property name available in the browser. Either default or vendor prefixed.
	If the property name can't be found we'll get Boolean 'false' and fail quickly */
	var flowFromProperty = Modernizr.prefixed("flowFrom"),
		flowIntoProperty = Modernizr.prefixed("flowInto");

	if (!flowFromProperty || !flowIntoProperty){
		return false;
	}

	/* If CSS parsing is there, try to determine if regions actually work. */
	var container		= document.createElement('div'),
		content			= document.createElement('div'),
		region			= document.createElement('div'),

	/* we create a random, unlikely to be generated flow number to make sure we don't
	clash with anything more vanilla, like 'flow', or 'article', or 'f1' */
	flowName = 'modernizr_flow_for_regions_check';

	/* First create a div with two adjacent divs inside it. The first will be the
	content, the second will be the region. To be able to distinguish between the two,
	we'll give the region a particular padding */
	content.innerText		= 'M';
	container.style.cssText	= 'top: 150px; left: 150px; padding: 0px;';
	region.style.cssText	= 'width: 50px; height: 50px; padding: 42px;';

	region.style[flowFromProperty] = flowName;
	container.appendChild(content);
	container.appendChild(region);
	document.documentElement.appendChild(container);

	/* Now compute the bounding client rect, before and after attempting to flow the
	content div in the region div. If regions are enabled, the after bounding rect
	should reflect the padding of the region div.*/
	var flowedRect, delta,
		plainRect = content.getBoundingClientRect();


	content.style[flowIntoProperty] = flowName;
	flowedRect = content.getBoundingClientRect();

	delta = flowedRect.left - plainRect.left;
	document.documentElement.removeChild(container);
	content = region = container = undefined;

	return (delta == 42);
});
;

