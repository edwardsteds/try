/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global d3 */
var margin = {top: 30, right: 20, bottom: 70, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;
var formatTime = d3.time.format("%e %B");

var x = d3.time.scale().range([0, width]);
var y0 = d3.scale.linear().range([height, 0]);
var y1 = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(10)
        .tickFormat(d3.time.format("%Y-%m-%d"));
        
var y0Axis = d3.svg.axis().scale(y0).orient("left").ticks(5);
var y1Axis = d3.svg.axis().scale(y1).orient("right").ticks(5);


var area = d3.svg.area() 
        .x(function(d) { return x(d.date); }) 
        .y0(height)
        .y1(function(d) { return y0(d.close); });

//take data out and put it in desired coordinate
var valueline = d3.svg.line() 
        .interpolate("basis")
        .y(function (d) {return y0(d.close);})
        .x(function (d) {return x(d.date);});
var valueline2 = d3.svg.line() 
        .interpolate("basis")
        .y(function (dd) {return y1(dd.open);})
        .x(function (dd) {return x(dd.date);});

var div = d3.select("body")
        .append("div") 
        .attr("class", "tooltip") 
        .style("opacity", 0.1);
//valueline =d3.svg.line()y(function (d) {return y(d.close);});
        
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    function make_x_axis() { 
        return d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5)
    }
    
    function make_y_axis() { 
        return d3.svg.axis()
        .scale(y0)
        .orient("left")
        .ticks(5)
    }

// Get the data
    console.log("hello1 ");
d3.tsv("data/data.tsv", function (data) {
    //data.forEach(function (d) {    
    //    console.log(d.date);
    //    d.date = parseDate(d.date);
    //    d.close = +d.close;
    //});
    for(var i = 0; i < data.length; i++) {
        //var objj = data[i];
        var obj = data[i];
        console.log("hello2 ");
        console.log("hello " + obj.date);
        console.log("hello3 ");

        obj.date = parseDate(obj.date);
        console.log("hello4 "+ obj.date);

        obj.close = +obj.close;
        console.log(obj.close);
        obj.open = +obj.open;

    }

/*      
//var data = [ {date:"1-May-12",close:"58.13"}, {date:"30-Apr-12",close:"53.98"}, {date:"27-Apr-12",close:"67.00"}, {date:"26-Apr-12",close:"89.70"}, {date:"25-Apr-12",close:"99.00"}];
for(var i = 0; i < data.length; i++) {
    //var objj = data[i];
    var obj = data[i];
    obj.date = parseDate(obj.date);
    obj.close = +obj.close;
    console.log(obj.date);
    console.log(obj.close);

} */
    // Scale the range of the data
    //console.log(data, function(d) { return d.date; });
    //console.dir(data); //this is ok
    console.log(JSON.stringify(data));
    x.domain(d3.extent(data, function (d) {return d.date;}));
    y0.domain([0,d3.max(data, function(d) {return d.close;})]);
    y1.domain([0,d3.max(data, function(d) {return d.open;})]);

    //y.domain([0, d3.max(data, function (d) {return Math.max(d.close, d.open);})]);
    
    svg.append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", y0(0)) //starting point
        .attr("x2", 0).attr("y2", y0(10)) //estimated ending point; 10 = 100%
        .selectAll("stop")
            .data([
                {offset: "0%", color: "red"},
                {offset: "40%", color: "red"},
                {offset: "40%", color: "black"},
                {offset: "62%", color: "black"},
                {offset: "62%", color: "lawngreen"},
                {offset: "100%", color: "lawngreen"}
            ])
        .enter().append("stop")
            .attr("offset", function(d) { return d.offset; }) 
            .attr("stop-color", function(d) { return d.color; });

    
    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);
    
    svg.append("path") // Add the valueline path.
       // .interpolate("basis")
        .attr("d", valueline(data))
        .attr("class", "line")
        .style("stroke-dasharray", ("3, 3"));

    svg.append("path") // Add the valueline path.
        .attr("class", "line2")
        .style("stroke", "red")
        .attr("d", valueline2(data));
        
    svg.selectAll("dott")
        .data(data)
        .enter().append("circle")
        //.filter(function(d) { return d.close < 40 })
        //.style("fill", "blue")   
        .style("fill", function(d){
            if (d.close < 4)
                {return "blue";}
            else
                {return "lawngreen";}
        })
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.date); }) //coordinate that draw the dot
        .attr("cy", function(d) { return y0(d.close); })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(formatTime(d.date) + "<br/>"  + d.close)
                .style("left", (d3.event.pageX) + "px") //place the div at the coordinate
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) { 
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });


    svg.append("g") // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end") 
            .attr("dx", "-.8em") 
            .attr("dy", ".15em") 
            .attr("transform", function(d) {
                return "rotate(-65)" 
            });

    svg.append("g")
        .attr("class", "y axis")
        .style("stroke-dasharray", ("3, 3"))
        .call(y0Axis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform","translate("+width+",0)")
        .style("stroke-dasharray", ("1, 1"))
        .style("fill","red")
        .call(y1Axis);

    svg.append("text")
        //.attr("x", width/2)
        //.attr("y", 0 + height + margin.bottom)
        .attr("transform", "translate(" + width/2 + "," +(height+margin.bottom)+")")
        .style("text-anchor", "middle")
        .text("Hello")
    
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .attr("x",0-height/2)
        .attr("y",0-margin.top)
        .text("this is y axis")
        .attr("dy", "1em")

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Value vs Date Graph");

    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_axis()
            .tickSize(-height, 0, 0)
            .tickFormat(""));

    svg.append("g")
        .attr("class", "grid")
        .call(make_y_axis()
        .tickSize(-width, 0, 0)
        .tickFormat("")
        )

    function tabulate(data, columns) {
        var table = d3.select("body").append("table")
            .attr("style", "margin-left: 250px"),
            thead = table.append("thead"),
            tbody = table.append("tbody");
            // append the header row
            thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
        .text(function(column) { return column; });
            // create a row for each object in the data
        var rows = tbody.selectAll("tr") .data(data)
            .enter()
            .append("tr");
            // create a cell in each row for each column
        var cells = rows.selectAll("td") 
            .data(function(row) {
            return columns.map(function(column) {
            return {column: column, value: row[column]};
            }); })
            .enter()
            .append("td")
            .attr("style", "font-family: Courier")
            .html(function(d) { return d.value; }); 
            return table;
    }
        // render the table
        var peopleTable = tabulate(data, ["date", "close"]);
  
});
//var inter = setInterval(function() {updateData();}, 2000);

function updateData() {
// Get the data again
    d3.tsv("data/data1.tsv", function(error, data) { 
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
        d.open = +d.open;

    });
    // Scale the range of the data again
    x.domain(d3.extent(data, function(d) { return d.date; })); 
    y0.domain([0, d3.max(data, function(d) { return d.close; })]);
    y1.domain([0, d3.max(data, function(d) { return d.open; })]);

    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();
    // Make the changes
    svg.select(".line") // change the line
        .duration(750)
        .attr("d", valueline(data))
        .duration(750)
        .attr("d", valueline2(data)); 

    svg.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
    svg.select(".y.axis") // change the y axis
        .duration(750)
        .call(y0Axis);
    svg.select(".y.axis") // change the y axis
        .duration(750)
        .call(y1Axis);

    }); }

 
    
    




            
            
        
    