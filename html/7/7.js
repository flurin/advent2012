/*

Digitpaint HTML and CSS Advent 2012

o-o                      o                o---o  o  o    
|  \                     |                   /   |  |    
|   O o-o  o-o o-o o-O-o O-o  o-o o-o       o   -o- O--o 
|  /  |-' |    |-' | | | |  | |-' |         |    |  |  | 
o-o   o-o  o-o o-o o o o o-o  o-o o         o    o  o  o 
                                                         
                                                         

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

document.addEventListener("DOMContentLoaded", function(){
  
  // Normalize battery api
  var battery = navigator.webkitBattery || navigator.mozBattery || navigator.battery;
  
  // Our elements
  var batteryEl = document.getElementById("battery");
  var statusEl = batteryEl.querySelector(".status");
  var chargeStatusEl = batteryEl.querySelector(".charge-status");
  var levelEl = batteryEl.querySelector(".level");
  var percentageEl = batteryEl.querySelector(".percentage");
    
  // Helper function to set status
  var setStatusText = function(msg){
    statusEl.innerHTML = msg;
  };
  
  // Helper to set charge status
  var setChargeStatus = function(){
    var msg;
    if (battery.chargingTime == Infinity && battery.dischargingTime < Infinity){
      msg = "You'll run out of juice in about <strong>"+formatSeconds(battery.dischargingTime)+"</strong>";
    } else if (battery.chargingTime < Infinity && battery.dischargingTime == Infinity) {
      msg = "In about <strong>"+formatSeconds(battery.chargingTime)+"</strong> you're fully charged";
    } else if (battery.charged < Infinity && battery.discharged < Infinity) {
      msg = "Woah, I don't know what to think of this: discharged in " + formatSeconds(battery.dischargingTime) + ", charged in " + formatSeconds(battery.chargingTime);
    } else {
      if(battery.level == 1){
        msg = "Full on juice";
      } else {
        msg = "Calculating charge/discharge time...";        
      }
      
    }
    chargeStatusEl.innerHTML = msg;
  }
  
  // Set percentage
  var setLevel = function(){
    // Hack to set background-size for the bar
    levelEl.value = battery.level;
    percentageEl.innerHTML = Math.round(battery.level * 100) + "%";
  }
  
  // Set chargingtime
  var setChargingChange = function(){
    if(battery.charging){
      setStatusText("Charging...");
    } else if(!battery.charging && battery.level == 1){
      setStatusText("100% full");
    } else{
      setStatusText("Losing juice...");
    } 
    setChargeStatus();
  }
  
  // Helper function to format seconds in to time format: HH:mm:ss
  var formatSeconds = function(seconds){
    if(seconds == Infinity){ return "infinity"; }
    
    var secondsLeft = Math.abs(seconds);
    var time = [];
    time.push(Math.floor(secondsLeft/3600));
    secondsLeft = secondsLeft % 3600
    time.push(Math.floor(secondsLeft/60));
    time.push(secondsLeft % 60);
    return time.map(function(v){ return v < 10 ? "0" + v : "" + v}).join(":");
  }
  
  // Too bad, no support for Battery API
  if(!battery){
    batteryEl.classList.add("unsupported");
    setStatusText("Sorry, your browser doesn't appear to support the Battery API.")
  } else {
    
    // Initial setup
    setChargingChange();
    setLevel();
    setChargeStatus();
    
    // Charging or not?
    battery.addEventListener("chargingchange", setChargingChange);
    
    // Battery level changed!
    battery.addEventListener("levelchange", setLevel);

    // Moarrrr juice!
    battery.addEventListener("chargingtimechange", setChargeStatus);

    // Woah, better get the charger!
    battery.addEventListener("dischargingtimechange", setChargeStatus);
    
    
  }
  
    
});
