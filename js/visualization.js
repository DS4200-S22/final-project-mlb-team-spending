
// set margins and dimensions 
const margin = { top: 50, right: 50, bottom: 50, left: 200 };
const width = 900; //- margin.left - margin.right;
const height = 650; //- margin.top - margin.bottom;
const yTooltipOffset = 15; 

// append svg object to the body of the page to house Success Score Line Graph
const svg1 = d3.select("#vis-container")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]);


// upload data
d3.csv("data/final_mlb_data.csv").then((data) => {
  
  // print first 10 rows of data to the console
  for (var i = 0; i < 10; i++) {
    console.log(data[i]);}

  // initialize variables
  let x1, y1;
  let xKey1, yKey1;
  
  // success score over seasons line graph 
  {
    xKey1 = 'Season';
    yKey1 = 'Success_Score';

    // find min and max years
    minX1 = d3.min(data, (d) => { return d[xKey1]; });
    maxX1 = d3.max(data, (d) => { return d[xKey1]; });
    
    // create x scale
    x1 = d3.scaleTime()
            .domain([new Date(minX1, 0, 1), new Date(maxX1, 0, 1)])
            .range([margin.left, width - margin.right]);

     // add x axis
     svg1.append("g")
     .attr("transform", `translate(0,${height - margin.bottom})`)
     .call(d3.axisBottom(x1))
     .selectAll("text")  
     .style("text-anchor", "end")
     .attr("dx", "-.8em")
     .attr("dy", ".15em")
     .attr("transform", "rotate(-65)")
     .attr("font-size", '20px')
     .call((g) => g.append("text")
                   .attr("x", width - margin.right)
                   .attr("y", margin.bottom - 4)
                   .attr("fill", "black")
                   .attr("text-anchor", "end")
                   .text(xKey1)
                   // TODO: make sure graph has x-axis label
                   );
  
  // find max success score
  maxY1 = d3.max(data, (d) => { return d[yKey1]; });

  // create y scale
  y1 = d3.scaleLinear()
              .domain([0, maxY1])
              .range([height - margin.bottom, margin.top]); 

  // add y axis 
  svg1.append("g")
      .attr("transform", `translate(${margin.left}, 0)`) 
      .call(d3.axisLeft(y1)) 
      .attr("font-size", '20px') 
      .call((g) => g.append("text")
                    .attr("x", 0)
                    .attr("y", margin.top)
                    .attr("fill", "black")
                    .attr("text-anchor", "end")
                    .text(yKey1));

  // add the div for tooltip
  const tooltip1 = d3.select("body")
                        .append("div")
                        .attr("id", "tooltip1")
                        .style("opacity", 0)
                        .attr("class", "tooltip");
  
  // add values to tooltip on mouseover
  const mouseover1 = function(event, d) {
    tooltip1.html("Year: " + d.Season + "<br> Success Score: " + d.Success_Score + "<br")
            .style("opacity", 1);
  };

  // position tooltip to follow mouse
  const mousemove1 = function(event, d) {
    tooltip1.style("left", (event.pageX) + "px")
            .style("top", (event.pageY + yTooltipOffset) + "px");
  };

  // return tooltip to transparent when mouse leaves
  const mouseleave1 = function(event, d) {
    tooltip1.style("opacity", 0);
  };

  // group by the team name
  var sumstat = d3.group(data, d => d.Team);

  // list of group names
  var res = Array.from(sumstat.keys());

  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(res)
    .enter()
    .append('option')
    .text((d) => { return d; }) 
    .attr("value", (d) => { return d; }); 

  // setting the color for each team (hex codes from the teams)
  const color = d3.scaleOrdinal()
    .domain(res)
    .range(['#CE1141','#DF4601', '#BD3039', '#0E3386', '#27251F', 
            '#C6011F', '#E31937', '#0C2340', '#002D62', '#004687',
            '#BA0021', '#005A9C', '#FFC52F', '#002B5C', '#FF5910',
            '#003087', '#003831', '#E81828', '#FDB827', '#2F241D',
            '#005C5C', '#FD5A1E', '#C41E3A', '#003278', '#134A8E', 
            '#AB0003', '#33006F', '#00A3E0', '#A71930', '#092C5C']);

// initialize line with first group of the list
const line = svg1.append('g')
                 .append("path")
                 .datum(data.filter((d) => {return d.Team == "ATL"}))
                 .attr("d", d3.line()
                                .x((d) => { return x1(new Date(d.Season, 0, 1)); })
                                .y((d) => { return y1(d.Success_Score); }))
                 .attr("stroke", (d) => { return color("valueA"); })
                 .style("stroke-width", 5)
                 .style("fill", "none");
                 // TODO label the lines with the team

// initialize circles with first group of the list
const circles = svg1.selectAll("circle")
                 .data(data.filter((d) => {return d.Team == "ATL"}))
                 .enter()
                 .append("circle")
                 .attr("cx", (d) => { return x1(new Date(d.Season, 0, 1)); })
                 .attr("cy", (d) => { return y1(d.Success_Score); })
                 .attr("r", 5)
                 .attr("fill", (d) => { return color("valueA"); })
                 // TODO color: can we make circles the same color as the line?
                 .on("mouseover", mouseover1) 
                 .on("mousemove", mousemove1)
                 .on("mouseleave", mouseleave1);

  // function to update the chart
function update(selectedGroup) {
  
  // create new data with the selection
  const dataFilter = data.filter((d) => {
    return d.Team == selectedGroup; } );

    // updated line data
    line
        .datum(dataFilter)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
                      .x((d) => { return x1(new Date(d.Season, 0, 1)); })
                      .y((d) => { return y1(d.Success_Score); }))
        .attr("stroke", (d) => { return color(selectedGroup); });

    // updated circles data
    // TODO: data for circles updates, but location does not
    circles
        .data(dataFilter)
        .transition()
        .duration(1000)
        .attr("cx", (d) => { return x1(new Date(d.Season, 0, 1)); })
         .attr("cy", (d) => { return y1(d.Success_Score); })
         .attr("r", 5)
         .attr("fill", (d) => { return color(selectedGroup); });
  }

  // run the update function when a new team is selected
  d3.select("#selectButton").on("change", function(event,d) {
    // determine the user's selected option
    const selectedOption = d3.select(this).property("value")
    
    // run the update function with the user's selection
    update(selectedOption)})

  }


});

