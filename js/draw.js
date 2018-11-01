var w = 800,
  h = 400;
var off = 30;

var NUM="1";
var num=0;


var LENGTH="1";
var needle_length = 20;




var total_cross = 0;
var total_try = 0;
var baseline_width = 800;
var baseline_gap = 40;
var baseline_number = 10;


var dataset=[];




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
  
  container.append("line").style("fill", "none").style("stroke", "#00AA90").attr("x1",x1).attr("x2",x2).attr("y1",y1).attr("y2",y2);
  
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
        
        NUM = d3.select(this).attr("val");
        d3.select("#speed .current").classed("current", false);
        d3.select(this).classed("current", true);  
        if(NUM=="1"){
            num=1;
        }else if(NUM=="10"){
            num=10;
        }else if(NUM=="100"){
            num=100;
        }else if(NUM=="1000"){
            num=1000;
        }
        drop();    
        $("#chart2").empty();
        scatterplot();
        
    });

    d3.selectAll("#length .button").on("click", function () {
        
        LENGTH = d3.select(this).attr("data-val");
        d3.select("#length .current").classed("current", false);
        d3.select(this).classed("current", true);  
        if(LENGTH=="1"){
            needle_length=20;
        }else if(LENGTH=="2"){
            needle_length=80;
        }
        // console.log(LENGTH);
        $("#chart1").empty();
        $("#chart2").empty();
        dataset=[];
        total_cross = 0;
        total_try = 0;
        num=0;
        draw();    
        
        
    });





    
    
}


function simulate(container, size) {
  var cross_number = 0;
  var i =0;
  for (; i< size; i++) {
      total_try++;
    if ( drawneedle(container) ) {
      cross_number++;
      total_cross++;
    }
    var s_pi = 2 * needle_length * total_try / ( baseline_gap * total_cross);
    if(s_pi != NaN && total_cross!=0){
        dataset.push([total_try,s_pi]);
        // console.log(s_pi);
        // console.log(total_cross);
        console.log(needle_length);
        console.log(baseline_gap);
        console.log(2 * needle_length/ baseline_gap);
        console.log(total_try / total_cross);
    } 
  }
  return cross_number;
}



function reset(){
    $("#chart1").empty();
    $("#chart2").empty();
    total_cross = 0;
    total_try = 0;    
    num=0;
    dataset=[];
    draw();
    wireButtonClickEvents();
}



function draw(){
    var root = d3.select("#chart1").append("svg").attr("width", w).attr("height", h).append("g").attr("transform", "translate(" + off + "," + off + ")");
    drawbaseline(root);
    drop();
    $("#chart2").empty();
    scatterplot();

}





function drop(){
    var sim_layer = d3.select("g").append("g");
    var cross = simulate(sim_layer, num);
    // total_cross = total_cross + cross;
    // total_try = total_try + num;
    var s_pi = 2 * needle_length * total_try / ( baseline_gap * total_cross);
    // if(s_pi) dataset.push([total_try,s_pi]);
    $("#lbtry").text(num);
    $("#lbcross").text(cross);
    $("#n").text(total_try);
    $("#cross").text(total_cross);
    // console.log(total_cross);
    // console.log(total_try);
    $("#pi").text(s_pi);
}


function scatterplot(){
    var margin = {top: 20, right: 15, bottom: 60, left: 60}
      , width = 800 - margin.left - margin.right
      , height = 450 - margin.top - margin.bottom;
    
    var x = d3.scaleLinear()
            //   .domain([0, d3.max(dataset, function(d) { return d[0]; })])
              .domain([0,10000])
              .range([ 0, width ]);
    
    var y = d3.scaleLinear()
              .domain([0,6])
    	    //   .domain([0, d3.max(dataset, function(d) { return d[1]; })])
    	      .range([ height, 0 ]);
 
    var chart = d3.select('#chart2')
	.append('svg:svg')
	.attr('width', width + margin.right + margin.left)
	.attr('height', height + margin.top + margin.bottom)
	.attr('class', 'chart')

    var main = chart.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	.attr('width', width)
	.attr('height', height)
	.attr('class', 'main')   
        
    // add the x Axis
    main.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    
    // add the y Axis
    main.append("g")
    .call(d3.axisLeft(y));

    var g = main.append("svg:g"); 
    
    g.selectAll("scatter-dots")
      .data(dataset)
      .enter().append("svg:circle")
    //   .style("stroke", "#00AA90")
          .attr("cx", function (d,i) { return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", 2);
}

