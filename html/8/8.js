/*

Digitpaint HTML and CSS Advent 2012

 #######                                       ##                        ####    ##   ##     
/##////##                                     /##                       #/// #  /##  /##     
/##    /##  #####   #####   #####  ########## /##       #####  ######  /#   /# ######/##     
/##    /## ##///## ##///## ##///##//##//##//##/######  ##///##//##//#  / #### ///##/ /###### 
/##    /##/#######/##  // /####### /## /## /##/##///##/####### /## /    #/// #  /##  /##///##
/##    ## /##//// /##   ##/##////  /## /## /##/##  /##/##////  /##     /#   /#  /##  /##  /##
/#######  //######//##### //###### ### /## /##/###### //######/###     / ####   //## /##  /##
///////    //////  /////   ////// ///  //  // /////    ////// ///       ////     //  //   // 

Copyright 2012 by Digitpaint. This code is licensed under the MIT License.

*/  

!function(){
  var timerEl, 
      prevQuestionEl,
      prevAnswerEl,
      prevImageEl,
      nextQuestionEl,
      nextImageEl,
      becameHiddenAt, 
      hiddenSeconds = 0;
  
  var questions = [
    ["How much does Charles Dickens and Ralph Cosham's unabridged Christmas Carol (Audible Audio) cost on Amazon.com?", "$ 9.95", "images/library_tiny.jpg"],
    ["How tall was the tallest Rockefeller Center christmas tree according to Wikipedia?", "30m", "images/ball_tiny.jpg"],
    ["How far does WolframAlpha say is the north pole from Nijmegen, The Netherlands?", "4256km", "images/snowfield_tiny.jpg"]
  ]
  
  // Normalize prefixed versions (based on http://www.html5rocks.com/en/tutorials/pagevisibility/intro/)
  var prefixes = (function getHiddenProp(){
    var prefixes = ['webkit','moz','ms','o'];
    
    // if 'hidden' is natively supported just return it
    if ('visibilityState' in document) {
      return ['visibilityState', "visibilitychange"];
    }
    
    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++){
        if ((prefixes[i] + 'VisibilityState') in document){
          return [prefixes[i] + 'VisibilityState', prefixes[i] + "visibilitychange"];
        }
    }

    // otherwise it's not supported
    return [null,null];
  })();
  
  var visibilityState = prefixes[0], visibilitychange = prefixes[1];
          
  document.addEventListener(visibilitychange, function(){
    var state = document[visibilityState];
    if(state == "visible"){
      // We just became visible
      hiddenSeconds += ((new Date()) - becameHiddenAt) / 1000
      
      timerEl.innerHTML = formatSeconds(hiddenSeconds);
      
      hiddenSeconds = 0;
      becameHiddenAt = null;
      
      // Show answer and next question
      nextQuestion();
      
    } else if(state == "hidden"){
      // We just got hidden
      becameHiddenAt = new Date();
    } else if(state == "prerender"){
      // Still prerendering, not visible yet
    } else {
      // This is an unknown state.
    }
  });
  
  var nextQuestion = function(){
    var q = questions.shift();
    
    if(nextQuestionEl.getAttribute("data-answer")){
      prevQuestionEl.parentNode.classList.remove("hidden");
      prevQuestionEl.innerHTML = nextQuestionEl.innerHTML;
      prevAnswerEl.innerHTML = nextQuestionEl.getAttribute("data-answer");        
      prevImageEl.src = nextImageEl.src;
    }
    
    if(q){
      nextQuestionEl.innerHTML = q[0];
      nextQuestionEl.setAttribute("data-answer", q[1]);
      nextImageEl.src = q[2];      
    } else {
      nextImageEl.parentNode.removeChild(nextImageEl);
      nextQuestionEl.innerHTML = "Sorry, that's all for today; no more questions, enjoy your day!"
      nextQuestionEl.removeAttribute("data-answer");      
    }
    
  };

  // Helper function to format seconds in to time format: HH:mm:ss
  var formatSeconds = function(seconds){
    if(seconds == Infinity){ return "infinity"; }
    
    var secondsLeft = Math.abs(seconds);
    var time = [];
    time.push(Math.floor(secondsLeft/3600));
    secondsLeft = secondsLeft % 3600
    time.push(Math.floor(secondsLeft/60));
    time.push(Math.round(secondsLeft % 60));
    return time.map(function(v){ return v < 10 ? "0" + v : "" + v}).join(":");
  }

  // Attach eventlisteners
  document.addEventListener("DOMContentLoaded", function(){
    prevQuestionEl = document.getElementById("prev-question");
    prevAnswerEl = document.getElementById("prev-answer");
    prevImageEl = document.getElementById("prev-image");
    nextQuestionEl = document.getElementById("next-question");
    nextImageEl = document.getElementById("next-image");
    timerEl = document.getElementById("timer");
        
    nextQuestion();
  });  
  
  
  
}();
