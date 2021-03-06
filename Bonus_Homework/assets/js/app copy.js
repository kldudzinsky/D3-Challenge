//Charts: 
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
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//scale
function xScale (data){
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.income), 
                d3.max(data, d=>d.income)
            ])
        .range([0,width])
    return xLinearScale
};
//initial params
var chosenXAxis = "income"; 

//function update circles group with transition to new circles
//function used for updating circles group w new toolTip
//initial params
var chosenXAxis= "income";
var first_yAxis="healthcare";
var second_xAxis="poverty";
var second_yAxis="smokes";
//function update --x-scale-- var upon click upon click on axis label
    function xScale(data, chosenXAxis){
    //create scales
        var xlinearScale = d3.scaleLinear()
            .domain([d3.min(data, d=> d[chosenXAxis])],
            [d3.max(data, d=>d.chosenXAxis)])
            .range([0,width])
        return xLinearScale;
    }
// function used for updating --xAxis-- var upon click on axis label
    function renderAxes(newXScale, xAxis){
        var bottomAxis = d3.axisBottom(newXScale);
        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);
        return xAxis;
    }
// function used for updating circles group with a 
        //transition to new circles
    function renderCircles(circlesGroup, newXScale, chosenXAxis){
        circlesGroup.transition()
                    .duration(1000)
                    .attr("cx", d=>newXScale(d[chosenXAxis]));
        return circlesGroup;
    }
// function used fort updating circles group with new tooltip
    function updateToolTip(chosenXAxis, circlesGroup){
        var label   
        
        if(chosenXAxis === "income"){
            label = "Income:";
        }
        else {
            label = "Poverty:"
        }
    
        var toolTip = d3.tip()
                    .attr("class", "tooltop")
                    .offset([80,-60])
                    .html(function(d){
                        return (`${d.abbr} <b> ${state}`);
                    })
        circlesGroup.call(toolTip);
        circlesGroup.on("mouseover", function(data){
            toolTip.hide(data);
        });
        return circlesGroup;
    }

//load csv Data
d3.csv("data.csv").then(function(data,err){
    if (err) throw err;
    //format
        data.forEach(function(data){
            data.income = +data.income;
            data.age=+data.age;
            data.healthcare = + data.healthcare;
            data.smokes = +data.smokes;
            data.obesity = +data.obesity; 
            data.poverty = +data.poverty;
        });
    //xlinear scale function
        var xLinearScale =xScale(data, chosenXAxis);
    //create y scale function
        var yLinearScale = d3.scaleLinear()
                .domain([0,d3.max(data, first_yAxis)])
                .range([height,0]);
    //initial axis functions
        var bottomAxis=d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
    //append x Axis
        var xAxis=chartGroup.append("g")
                .classed("x-axis", true)
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);
    //append y axis
        chartGroup.append("g")
                .call(leftAxis);
    //append initial circles
        var circlesGroup = chartGroup.selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", d=> xLinearScale(d.chosenXAxis))
                            .attr("cy", d=> yLinearScale(d.first_yAxis))
                            .attr("r", 20)
                            .attr("fill", "blue")
                            .attr("opacity", ".5");
    //group for 2 x-axis labels
        var labelsGroup = chartGroup.append("g")
                    .attr("transform", `translate(${width / 2}, ${height + 20})`);
        var incomeLabelX= labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "income") 
            .classed("active", true) 
            .text("Income")
        var healthcareLabelY= labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "healthcare") 
            .classed("active", true) 
            .text("HealthCare Percentage")
        var smokesLabelY= labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "smokes") 
            .classed("inactive", true) 
            .text("Smoke Percentage")
        var povertyLabelX= labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "income") 
            .classed("inactive", true) 
            .text("Poverty Percentage")
    //append text to circles
    chartGroup.append("text")
    .attr("transform", "rotate(-90)") //rotate -90 makes up and down
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em") //em spacing w text stuff 
    .classed("axis-text", true)
    .text("Number of Billboard 500 Hits");
    
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup); 
    // set up Click Handler
        labelsGroup.selectAll("text")
            .on("click", function() {
            var value = d3.select(this).attr("value");
                if (value !== chosenXAxis){
                    chosenXaxis=value;
                    xLinearScale =xScale(data, chosenXAxis);
                    xAxis=renderAxes(xLinearScale,xAxis);
                    circlesGroup = renderCircles(circlesGroup, xlinearScale, chosenXAxis);
                    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                    if(chosenXAxis === "income"){
                        incomeLabelX
                            .classed("active", true)
                            .classed("inactive", false);
                        healthcareLabelY
                            .classed("active", true)
                            .classed("inactive", false);
                        povertyLabelX
                            .classed("active", false)
                            .classed("inactive", true);
                        smokesLabelY
                            .classed("active", false)
                            .classed("inactive", true);
                        }
                    else{
                        incomeLabelX
                            .classed("active", false)
                            .classed("inactive", true);
                        healthcareLabelY
                            .classed("active", false)
                            .classed("inactive", true);
                        povertyLabelX
                            .classed("active", true)
                            .classed("inactive", false);
                        smokesLabelY
                            .classed("active", true)
                            .classed("inactive", false);
                        }
                }
        
        });

    }).catch(function(error){
        console.log(error)
    });