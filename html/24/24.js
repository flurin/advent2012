/*

Digitpaint HTML and CSS Advent 2012

 __, __,  _, __, _, _ __, __, __,    _,   , ___ _,_
 | \ |_  / ` |_  |\/| |_) |_  |_)   ~ ) / |  |  |_|
 |_/ |   \ , |   |  | |_) |   | \    /  ~~|  |  | |
 ~   ~~~  ~  ~~~ ~  ~ ~   ~~~ ~ ~   ~~~   ~  ~  ~ ~
                                                   

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

var ctx; 
var w, h;
var snowCanvas, bgCanvas;

var loadedImages = 0;
var nrOfImages = 0;
var loadImage = function(key, img){
  nrOfImages += 1;
  var r = new Image(); 
  r.onload = function(){
    images[key] = imageToCanvas(this);
    
    loadedImages += 1;
    if(loadedImages == nrOfImages){
      startDraw();
    }
  }
  r.src = img; 
  return r
}

loadImage("moon", "/images/moon.svg"),
loadImage("mountains", "/images/mountains.svg"),
loadImage("tree", "/images/tree.svg"),  
loadImage("trees-back", "/images/trees-back.svg")

var images = {};

var imageToCanvas = function(img){
  var canvas = document.createElement("canvas");
  var tW = img.width; 
  var tH = img.height;
  canvas.width = tW; canvas.height = tH;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);    
  return canvas;
}


var startDraw = function(){
  // var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
  
  // Call the drawing method X times a second
  // setInterval( function () {
  //   if(requestAnimationFrame){
  //     requestAnimationFrame( draw );
  //   } else {
  //     draw();
  //   }
  // }, 1000 / 15 );

  draw();
}

var pageCanvas;

var getCtxData = function(){
  var nW = document.documentElement.offsetWidth;
  var nH = document.documentElement.offsetHeight;
  var nCtx, nCanvas;

  if(document.getCSSCanvasContext){
    if(ctx && w == nW && h == nH){
      nCtx = ctx;
    } else {
      nCtx = document.getCSSCanvasContext("2d", "page-bg", nW, nH);  
    }
    
  } else {
    if(pageCanvas && ctx && w == nW && h == nH){
      nCanvas = pageCanvas;
      nCtx = ctx;
    } else {
      nCanvas = document.createElement("canvas");
      if(document.mozSetImageElement){
        document.mozSetImageElement("page-bg", nCanvas);
      } else {
        nCanvas.id = "page-bg";
      }
      nCanvas.width = nW;
      nCanvas.height = nH;
      nCtx = nCanvas.getContext("2d");
    }
    
  }  
  
  return [nW, nH, nCtx, nCanvas];
}

var drawing = false;
var draw = function(){
  if(drawing){ return; }  
  drawing = true;
  
  var data = getCtxData();
  w = data[0];
  h = data[1];
  ctx = data[2];
  pageCanvas = data[3];
  
  ctx.clearRect(0,0,w,h);

  if(!bgCanvas){
    prerenderBg();
  } 
  ctx.drawImage(bgCanvas, 0, 0);
  
  if(!snowCanvas){
    var snowImage = new Image();
    snowImage.onload = function(){
      prerenderSnow(imageToCanvas(this));
      drawSnow(0);
    }
    snowImage.src = "/images/snow.svg"
    
  } else {
    drawSnow(0);
  }
  
  drawing = false;
}

var prerenderSnow = function(snow){
    
  snowCanvas = document.createElement('canvas');
  snowCanvas.width = w;
  snowCanvas.height = 2 * h;
  
  var ctx = snowCanvas.getContext("2d");
  
  var left = 0, top = 0;
  while(top < 2*h){
    while(left < w){
      ctx.drawImage(snow, left, top);
      left += snow.width;      
    }
    left = 0;
    top += snow.height;
  }
}

var prerenderBg = function(){
  w = document.documentElement.offsetWidth;
  h = document.documentElement.offsetHeight;
  bgCanvas = document.createElement("canvas");
  bgCanvas.width = w;
  bgCanvas.height = h;
  var ctx = bgCanvas.getContext("2d");
  
  ctx.clearRect(0,0,w,h);

  // Paint purple BG
  ctx.fillStyle = "#240029"
  ctx.fillRect(0,0,w,h);
  
  drawMoon(ctx, 0);
  drawMountains(ctx, 0);
  drawTrees(ctx, 0);
  
}

var drawSnow = function(pos){  
  ctx.drawImage(snowCanvas, 0, 0);
}

var drawTrees = function(ctx, pos){
  
  var bottom = h - document.querySelector(".main > .bottom").offsetHeight;

  // Back trees
  var bTree = images["trees-back"];
  ctx.drawImage(bTree, 0, bottom - bTree.height + 20, w, bTree.height);
    
  var tree = images["tree"];
  
  var rotationMin = -15 * Math.PI/180, rotationMax = 15 * Math.PI/180,
    scaleMin = 0.2, scaleMax = 1,
    bottomMin = -50, bottomMax = 10;
  
  var r, s = 0, t = 0;
    
  var left = 0;
  while(left < (w - (tree.width * s / 2))){
    r = rotationMin + Math.random(20) * (rotationMax - rotationMin);
    t = Math.round(bottomMin + Math.random() * (bottomMax - bottomMin));    
    s = scaleMax - Math.abs(t/(bottomMax - bottomMin)) * (scaleMax - scaleMin);
    
    ctx.save();
    ctx.translate(left, Math.round(bottom - (tree.height * s)));
    ctx.rotate(r);
    ctx.drawImage(tree, 0, t, Math.round(tree.width * s), Math.round(tree.height * s));
    ctx.restore();
    
    left += tree.width*s/1.8;
    
  }

}

var drawMountains = function(ctx, pos){
  var mountains = images["mountains"];
  var baseTop = 260
  var scale = w/mountains.width
  var mH = scale * mountains.height;
  ctx.drawImage(mountains, 0, baseTop, w, Math.round(mH));
  
  ctx.fillStyle = "#0A1529";
  ctx.fillRect(0, baseTop + mH - 1, w, h - baseTop + mH + 1);
  
  var moonshineColors = []
  for(var i=13; i > 0; i-- ){
    var step = 0.03
    moonshineColors.push("rgba(176, 221, 246, "+step*i+")");
  }

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(scale * 0,   baseTop + scale * 103);
  ctx.lineTo(scale * 93,  baseTop + scale * 74);
  ctx.lineTo(scale * 141, baseTop + scale * 109); 
  ctx.lineTo(scale * 205, baseTop + scale * 75); 
  ctx.lineTo(scale * 302, baseTop + scale * 55);
  ctx.lineTo(scale * 368, baseTop + scale * 20);   
  ctx.lineTo(scale * 537, baseTop + scale * 61);   
  ctx.lineTo(scale * 600, baseTop + scale * 7);   
  ctx.lineTo(scale * 693, baseTop + scale * 65);   
  ctx.lineTo(scale * 760, baseTop + scale * 30);   
  ctx.lineTo(scale * 841, baseTop + scale * 38);   
  ctx.lineTo(scale * 900, baseTop + scale * 30);   
  ctx.lineTo(scale * 949, baseTop + scale * 0);                 
  ctx.lineTo(scale * 978, baseTop + scale * 53);
  ctx.lineTo(scale * 1041,baseTop + scale *  91)
  ctx.lineTo(scale * 1111,baseTop + scale *  71);
  ctx.lineTo(scale * 1200,baseTop + scale *  20); 
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.lineTo(0, baseTop + scale * 103);  
  ctx.closePath();
  ctx.clip();
     
  ctx.fillStyle = createSteppedGradient(moonshineColors, 125, 125, 750)
  ctx.fillRect(0,0,1500,1500);
  ctx.restore();
}

var drawMoon = function(ctx, pos){
  var baseTop = 0;
  
  // Moonshine
  var moonshineColors = ["#8b4f2a", "#854a2a", "#7d4429", "#773e2a", "#70382b", "#68312a", "#5f2c29", "#58252a", "#4e1e2a", "#46172b", "#3b102b", "#30082a","#25002b"];
  ctx.fillStyle = createSteppedGradient(moonshineColors, 125, 125 + baseTop, 750);
  ctx.fillRect(0,0, 1500, 1500);

  var moon = images["moon"];
  ctx.drawImage(moon, Math.round(125 - moon.width/2), Math.round(125 + baseTop - moon.height/2));  
}

var createSteppedGradient = function(colors, x, y, d){
  var grad = ctx.createRadialGradient(x, y, 0, x, y, d);
  var step = 1/colors.length;
  for(var i=0; i < colors.length; i++){
    grad.addColorStop(i * step, colors[i]);
    grad.addColorStop((i + 1) * step, colors[i]);
  }
  return grad;
}

window.addEventListener("resize", function(){
  bgCanvas = null;
  snowCanvas = null;
  draw();
})
