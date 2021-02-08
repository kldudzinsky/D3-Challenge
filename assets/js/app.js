//Charts: x: income, ys: poverty, age 
//y labels: Poverty and age 
// x label: Income 
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
//initial params
var chosenXAxis = "income";
//scale
function xScale (data){
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.income), 
                d3.max(data, d=>d.income)
            ])
        .range([0,width])
    return xLinearScale
};
//load and read CSV 
d3.csv("data.csv").then(function(data){
    //if (err) throw err; 
    //format
        data.forEach(function(data){
            data.income = +data.income;
            data.age=+data.age;

        });
    
    //xLinearScale function above CSV import
        var xLinearScale = xScale(data);
    //setting linear scales for age y1 and poverty y2
        var yLinearScaleAge= d3.scaleLinear()
            .domain([20,d3.max(data, d=>d.age)])
            .range([height, 0]);
       
    //create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxisAge = d3.axisLeft(yLinearScaleAge);
    
    //append x Axis
    var xAxis = chartGroup.append("g")
        //.classed("active", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    //append y axes
    var YAAxis = chartGroup.append("g")
        .call(leftAxisAge);
    
    //append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d=> xLinearScale(d.income))
        .attr("cy", d=> yLinearScaleAge(d.age))
        .attr("r",25)
        .attr("fill", "blue")
        .attr("opacity", ".5")       
        //circle abbr labels
        chartGroup.selectAll(".myLabel")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "myLabel")
        .text((d) => (d.abbr))
        .attr("x", d=> xLinearScale(d.income))
        .attr("y", d=> yLinearScaleAge(d.age))
     });
     
        
//axes labels
   var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    //age label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)") 
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "age")
        .text("Age");
    //income label
    var incomeLable = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "income") 
    .text("Income");
    

       