var w = 800,
  h = 400;
var off = 30;

var SPEED="2000";
var speed=2000;
var baseline_width = 800;
var baseline_gap = 40;
var baseline_number = 10;

var needle_length = 14;


$(document).ready(function () {
    draw();
    wireButtonClickEvents();
});



function drawbaseline(container) {
  var i = 0, length = baseline_number;
  var base = "";
  for ( ; i < length; i ++ ) {
    base = base + "M 0 " + i* baseline_gap + " H 0 800 ";
  }
  container.append("path").style("fill", "none").style("stroke", "fff").attr("d",base);
}

function drawcross(x,y,container) {
    var circle = container.append("circle").attr("cx", x).attr("cy", y).attr("r", 2)
        .attr("stroke", "#666").attr("stroke-width", 1).attr("fill", "#000");
    return circle;
}

function between(x, a, b) {
  if ( x > a && x < b ) {
    return true;
  }
  
  if ( x < a && x > b ) {
    return true;
  }
  
  return false;
}

function drawneedle(container, oncomplete) {
  var cx = Math.random() * baseline_width;
  var cy = Math.random() * ( baseline_gap * ( baseline_number -1) );
  var alpha = Math.random() * Math.PI *2;
  var dy = needle_length/2 * Math.sin(alpha);
  var dx = needle_length/2 * Math.cos(alpha);
  
  var x1 = cx - dx;
  var x2 = cx + dx;
  var y1 = cy - dy;
  var y2 = cy + dy;
  
  container.append("line").style("fill", "none").style("stroke", "#fa6900").attr("x1",x1).attr("x2",x2).attr("y1",y1).attr("y2",y2);
  
  var b = cy-cx*Math.tan(alpha);
  var a = Math.tan(alpha);
  //console.log("a = " + a + " b = " + b);
  //console.log(" x1 = " + x1 + " x2 = " + x2  + " y1 = " + y1 + " y2 = " + y2);
  var i = 0, len = baseline_number;
  for ( ; i < len ; i++) {
    var crossy = i*baseline_gap;
    var crossx = ( crossy - b ) / a;  
    //console.log("CrossX = " + crossx + "CrossY = " + crossy);
    //drawcross(crossx,crossy,container);
    if (between(crossx, x1, x2 ) && between(crossy, y1, y2 )) {
        drawcross(crossx,crossy,container);
        return true;
    }
  }
  return false;
}

function wireButtonClickEvents() {
    
    
    d3.selectAll("#speed .button").on("click", function () {
        
        SPEED = d3.select(this).attr("val");
        d3.select("#speed .current").classed("current", false);
        d3.select(this).classed("current", true);  
        if(SPEED=="2000"){
            speed=2000;
        }else if(SPEED=="500"){
            speed=500;
        }else if(SPEED=="50"){
            speed=50;
        }else if(SPEED=="5"){
            speed=5;
        }
        $("#chart1").empty();
        total_cross = 0;
        total_try = 0;
        draw();    
        
    });


    
    
}


function simulate(container, size) {
  // TODO : clean the container
  var cross_number = 0;
  var i =0;
  for (; i< size; i++) {
    if ( drawneedle(container) ) {
      cross_number++;
    }
  }
  return cross_number;
}

function pause(){
    clearInterval(timer);
}

function resume(){
    setInterval(timer);
}


function reset(){
    $("#chart1").empty();
    total_cross = 0;
    total_try = 0;
    draw();
    wireButtonClickEvents();
}


// 修改total_cross!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function draw(){
    var root = d3.select("#chart1").append("svg").attr("width", w).attr("height", h).append("g").attr("transform", "translate(" + off + "," + off + ")");
  drawbaseline(root);
  var sim_layer = root.append("g");
  var total_cross = 0;
  var total_try = 0;
  var single_try = 20;
  
  
var timer = setInterval(function(){
    var cross = simulate(sim_layer, single_try);
    total_cross = total_cross + cross;
    total_try = total_try + single_try;
    var s_pi = 2 * needle_length * total_try / ( baseline_gap * total_cross);
    $("#lbtry").text(single_try);
    $("#lbcross").text(cross);
    $("#n").text(total_try);
    $("#cross").text(total_cross);
    $("#pi").text(s_pi);



    
    if ((total_try >= 100)) {
      clearInterval(timer);
    }

    


  }, speed);

  $("#pause").click(function(){
    clearInterval(timer);
})


}

