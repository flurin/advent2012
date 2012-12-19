/*

Digitpaint HTML and CSS Advent 2012

                                                             
,--.                     |                   '|,--.|    |    
|   |,---.,---.,---.,-.-.|---.,---.,---.      |,--.|--- |---.
|   ||---'|    |---'| | ||   ||---'|          ||  ||    |   |
`--' `---'`---'`---'` ' '`---'`---'`          ``--'`---'`   '
                                                             

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

document.addEventListener("DOMContentLoaded", function(){
  
  var container = document.getElementById("container");
  var canvas;
  
  // ==================
  // = Draw the lines =
  // ==================
  // 
  var drawArrows = function(){
    var w = container.offsetWidth, h = container.offsetHeight;
    var ctx;
    
    // ==========================
    // = Get the canvas/context =
    // ==========================
    
    if(document.getCSSCanvasContext){
      ctx = document.getCSSCanvasContext("2d", "arrows", w, h);  
    } else {
      var canvas = document.createElement("canvas");
      if(document.mozSetImageElement){
        document.mozSetImageElement("arrows-bg", canvas);
      } else {
        canvas.id = "arrows-bg";
      }
      canvas.width = w;
      canvas.height = h;
      ctx = canvas.getContext("2d");
    }    
    
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.clearRect(0,0,w,h);
    
    var elements = container.querySelectorAll(".connect");
  
    var cY, cX, nY, nX;
    var cpBX, cpBY, cpEX, cpEY;
    var arrowOffset = 3;
    var ellpiseOffset = 2;
  
    for(var i = 0; i < elements.length; i++){
      var c = elements[i];
      var n = elements[i+1];
      
      ctx.save();
      ctx.strokeStyle = "rgba(255,0,0,0.5)"
      drawEllipse(ctx, c.offsetLeft - ellpiseOffset, c.offsetTop - ellpiseOffset, c.offsetWidth + 2*ellpiseOffset, c.offsetHeight + 2* ellpiseOffset);
      ctx.restore();
          
      if(n){
        cY = c.offsetTop + c.offsetHeight;
        cX = c.offsetLeft + (c.offsetWidth / 2);

        nY = n.offsetTop - arrowOffset;
        nX = n.offsetLeft + (n.offsetWidth / 2);
        
        
        if (c.offsetTop == n.offsetTop){
          cY += arrowOffset;
          nY = cY;
          
          cpBX = cX + (nX - cX)/2;
          cpBY = cY + 10;

          cpEX = nX - (nX - cX)/2;
          cpEY = cY + 10;
        } else if (cX > nX) {
          cpBX = cX;
          cpBY = cY + 20;

          cpEX = nX;
          cpEY = nY - 20;
        } else{
          cpBX = cX + (nX - cX)/2 + 20
          cpBY = cY + (nY - cY)/2

          cpEX = cX + (nX - cX)/2 + 20
          cpEY = cY + (nY - cY)/2                              
        }
      
        ctx.beginPath();
        ctx.moveTo(cX, cY);
        ctx.bezierCurveTo(cpBX, cpBY, cpEX, cpEY, nX, nY);
        ctx.stroke();
      
        var angle = findAngle(cpBX, cpBY, nX, nY);
        
        drawArrowhead(ctx, nX, nY, angle, 10, 10);
      
      }
    }    
  }
  
  // ===========
  // = Helpers =
  // ===========
  
  var drawArrowhead = function(ctx, locx, locy, angle, sizex, sizey) {
    var hx = sizex / 2;
    var hy = sizey / 2;
    ctx.save();
    
    ctx.translate((locx ), (locy));
    ctx.rotate(angle);        
    ctx.translate(-hx, -hy);

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,1*sizey);    
    ctx.lineTo(1*sizex,1*hy);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
  
  function drawEllipse(ctx, x, y, w, h) {
    var kappa = .5522848;
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
    ctx.stroke();
  }  
  
  // returns radians
  var findAngle = function(sx, sy, ex, ey) {
    // make sx and sy at the zero point
    return Math.atan((ey - sy) / (ex - sx));
  }  
  
  // ==========
  // = Events =
  // ==========
  
  // Initial draw
  drawArrows();

  // Resize
  window.addEventListener("resize", drawArrows);
    
  // # Observering the dom
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  if(MutationObserver){
    var observer = new MutationObserver(function(mutations){
      drawArrows();
    })
  
    observer.observe(container, { subtree: true, characterData : true, childList: true });    
  }
  
  // Add more text button
  var txt = "By adding a lot more text you can see that this is totally dynamic, the arrows should stay connected to the text ellipses.";
  var pEl = container.querySelector("p:nth-child(2)");
  document.getElementById("add-text-to-2nd-p").addEventListener("click", function(){
    pEl.innerHTML = pEl.innerHTML + " " + txt;
  })
  
  
});
  
