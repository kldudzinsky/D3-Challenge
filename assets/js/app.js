//Charts: x: income, ys: poverty, age 
//x labels: Poverty and age 
// y label: Income 
//Scatter plot 1: Income v Poverty
//scatter plot 2: income v Age 


//set up chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//create SVG Wrapper
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
 //load csv 
d3.csv("data.csv").then(function(data){
    //format
        data.forEach(function(data){
            data.income = +data.income;
            data.age=+data.age;
            data.poverty=+data.poverty;
        });
    //setting linear scales for income x, age y1 and poverty y2
        var xLinearScale = d3.scaleLinear()
            .domain(d3.extent(data, d=>d.income))
            .range([0, width]);
        var yLinearScaleAge= d3.sclaeLinear()
            .domain(d3.max(data, d=>d.age))
            .range([height, 0]);
        // var yLinearScalePoverty=d3.scaleLinear()
        //     .domain(d3.max(data, d=>d.poverty))
        //     .range([height,0]);
    //functions to pass scales in as arguments
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxisAge = d3.axisLeft(yLinearScaleAge);
        // var leftAxisPoverty = d3.axisLeft(yLinearScalePoverty);
    //configure line function to plot coordinates
    var LineA = d3.line()
        .x(data => xLinearScale(data.income))
        .y(data => yLinearScaleAge(data.age));
    // var LineP= d3.line()
    //     .x(data => xLinearScale(data.income))
    //     .y(data => yLinearScaleAge(data.poverty));
    //append SVg path
    chartGroup.append("path")
        .attr("d". LineA(data))
        .classed("scatter", true);
    //append svg group element to chartgroup to create left axis
    chartGroup/append("g")
        .classed("axis", true)
        .call(leftAxisAge)
    chartGroup.append("g")
        .classed("axis", true)
        .attr("transform", `translate${height}`)
        .call(bottomAxis);
   }).catch(function(error){
       console.log(error)
   });