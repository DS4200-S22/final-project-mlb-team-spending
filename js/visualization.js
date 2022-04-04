
// set margins and dimensions 
const margin = { top: 50, right: 50, bottom: 50, left: 200 };
const width = 900; //- margin.left - margin.right;
const height = 650; //- margin.top - margin.bottom;
const yTooltipOffset = 15; 

// append svg object to house Success Score Line Graph
const svg1 = d3.select("#vis-container")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]);

// Initialize brush for Line Graph 1 and points. We will need these to be global. 
let brush1; 

// append svg object to house OD Salary Line Graph
const svg2 = d3.select("#vis-container")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]);

// Initialize brush for Line Graph 2 and points. We will need these to be global. 
let brush2; 

// append svg object to house AL bracket
const svg3 = d3.select("#vis-container2")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]);                

// append svg object to house NL bracket
const svg4 = d3.select("#vis-container2")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]);   

// upload data
d3.csv("data/final_mlb_data.csv").then((data) => {

  // initialize variables
  let x1, y1, x2, y2;
  let xKey1, yKey1, xKey2, yKey2;
  let circles, circles2;
  
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
                    .attr("y", margin.top - 10)
                    .attr("fill", "black")
                    .attr("text-anchor", "end")
                    .text("Percent Wins"));

  // add the div for tooltip
  const tooltip1 = d3.select("body")
                        .append("div")
                        .attr("id", "tooltip1")
                        .style("opacity", 0)
                        .attr("class", "tooltip");
  
  // add values to tooltip on mouseover
  const mouseover1 = function(event, d) {
    tooltip1.html("Year: " + d.Season + "<br> Percent Wins: " + d.Success_Score + "%" + "<br")
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
    .range(['#CE1141','#DF4601', '#BD3039', '#0E3386', '#27201F', 
            '#C6011F', '#E31937', '#0C2340', '#002D62', '#004687',
            '#BA0021', '#005A9C', '#FFC52F', '#002B5C', '#FF5910',
            '#003087', '#003831', '#E81828', '#FDB827', '#2F241D',
            '#005C5C', '#FD5A1E', '#C41E3A', '#003278', '#134A8E', 
            '#AB0003', '#33006F', '#00A3E0', '#A71930', '#092C5C']);

// initialize line with first team
const line = svg1.append('g')
                 .append("path")
                 .datum(data.filter((d) => {return d.Team == "ATL"}))
                 .attr("d", d3.line()
                                .x((d) => { return x1(new Date(d.Season, 0, 1)); })
                                .y((d) => { return y1(d.Success_Score); }))
                 .attr("stroke", (d) => { return color("valueA"); })
                 .style("stroke-width", 5)
                 .style("fill", "none");

// initialize circles with first team
circles = svg1.selectAll("circle")
                 .data(data.filter((d) => {return d.Team == "ATL"}))
                 .enter()
                 .append("circle")
                 .attr("cx", (d) => { return x1(new Date(d.Season, 0, 1)); })
                 .attr("cy", (d) => { return y1(d.Success_Score); })
                 .attr("r", 5)
                 .style("fill", (d) => { return color("valueA"); })
                 .on("mouseover", mouseover1) 
                 .on("mousemove", mousemove1)
                 .on("mouseleave", mouseleave1);

// initialize line label with first team
var success_2018 = data.filter((d) => {return d.Team == "ATL"})[data.filter((d) => {return d.Team == "ATL"}).length - 1].Success_Score ;
const label = svg1.append("text")
              .attr("transform", "translate(" + (x1(new Date(2018, 0, 1)) + 10) + "," + y1(success_2018) + ")")
              .attr("dy", ".35em")
              .attr("text-anchor", "start")
              .style("fill", (d) => { return color("valueA"); })
              .text(res[0]);

  // function to update the chart
function update(selectedGroup) {
  
  // create new data with the selection
  const dataFilter = data.filter((d) => {
    return d.Team == selectedGroup; } );

    // updated line data
    line
        .datum(dataFilter)
        //.transition()
        //.duration(1000)
        .attr("d", d3.line()
                      .x((d) => { return x1(new Date(d.Season, 0, 1)); })
                      .y((d) => { return y1(d.Success_Score); }))
        .attr("stroke", (d) => { return color(selectedGroup); });

    // updated circles data
    circles = svg1.selectAll("circle")
                  .data(dataFilter)
                  .enter()
                  .append("circle")
                  .attr("cx", (d) => { return x1(new Date(d.Season, 0, 1)); })
                  .attr("cy", (d) => { return y1(d.Success_Score); })
                  .attr("r", 5)
                  .style("fill", (d) => { return color(selectedGroup); })
                  .on("mouseover", mouseover1) 
                  .on("mousemove", mousemove1)
                  .on("mouseleave", mouseleave1);
    // TODO add in transitions for line, circle, label ?

    // updated line label data
    success_2018 = dataFilter[dataFilter.length - 1].Success_Score ; 
    label
        .attr("transform", "translate(" + (x1(new Date(2018, 0, 1)) + 10) + "," + y1(success_2018) + ")")
        .style("fill", (d) => { return color(selectedGroup); })
        .text(selectedGroup) ;

    //Define a brush1
    const brush1 = d3.brush();

    //Add brush1 to svg1
    svg1.append("g")
        .attr("class", "brush")
        .call(brush1.extent( [ [0,0], [width,height] ] )
                    .on("start brush", updateChart1));
    }
}

  // spending over seasons line graph
  {
    xKey2 = 'Season';
    yKey2 = 'OD_Salary';

    // finding the min and max years
    minX2 = d3.min(data, (d) => { return d[xKey2]; });
    maxX2 = d3.max(data, (d) => { return d[xKey2]; });

    // create x scale
    x2 = d3.scaleTime()
            .domain([new Date(minX2, 0, 1), new Date(maxX2, 0, 1)])
            .range([margin.left, width - margin.right]) ;

    // add x axis
    svg2.append("g")
     .attr("transform", `translate(0,${height - margin.bottom})`)
     .call(d3.axisBottom(x2))
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
                   .text(xKey2)
                   // TODO: make sure graph has x-axis label
                   );

    // find max OD salary
    maxY2 = d3.max(data, (d) => { return +d[yKey2]; });

    // create y scale
    y2 = d3.scaleLinear()
              .domain([0, maxY2])
              .range([height - margin.bottom, margin.top]);

    // add y axis 
  svg2.append("g")
          .attr("transform", `translate(${margin.left}, 0)`) 
          .call(d3.axisLeft(y2)) 
          .attr("font-size", '20px') 
          .call((g) => g.append("text")
                        .attr("x", 0)
                        .attr("y", margin.top - 10)
                        .attr("fill", "black")
                        .attr("text-anchor", "end")
                        .text(yKey2));


  // add the div for tooltip
  const tooltip2 = d3.select("body")
                        .append("div")
                        .attr("id", "tooltip2")
                        .style("opacity", 0)
                        .attr("class", "tooltip");

// function to format the salary in dollar form
function currency(current_int) {
  return "$" + d3.format(",.2f")(current_int);
}

// add values to tooltip on mouseover
const mouseover2 = function(event, d) {
  tooltip2.html("Year: " + d.Season + "<br> OD Salary: " + currency(+d.OD_Salary) + "<br> Average Salary: " + currency(get_average(d.Season)) + "<br")
          .style("opacity", 1);
};

// position tooltip to follow mouse
const mousemove2 = function(event, d) {
  tooltip2.style("left", (event.pageX) + "px")
          .style("top", (event.pageY + yTooltipOffset) + "px");
};

// return tooltip to transparent when mouse leaves
const mouseleave2 = function(event, d) {
  tooltip2.style("opacity", 0);
};

// group by the team name
var sumstat2 = d3.group(data, d => d.Team);

// list of group names
var res2= Array.from(sumstat2.keys());

// setting the color for each team (hex codes from the teams)
const color2 = d3.scaleOrdinal()
    .domain(res2)
    .range(['#CE1141','#DF4601', '#BD3039', '#0E3386', '#27201F', 
            '#C6011F', '#E31937', '#0C2340', '#002D62', '#004687',
            '#BA0021', '#005A9C', '#FFC52F', '#002B5C', '#FF5910',
            '#003087', '#003831', '#E81828', '#FDB827', '#2F241D',
            '#005C5C', '#FD5A1E', '#C41E3A', '#003278', '#134A8E', 
            '#AB0003', '#33006F', '#00A3E0', '#A71930', '#092C5C']);

// initialize line with first team
const line2 = svg2.append('g')
                 .append("path")
                 .datum(data.filter((d) => {return d.Team == "ATL"}))
                 .attr("d", d3.line()
                                .x((d) => { 
                                  return x2(new Date(d.Season, 0, 1)); })
                                .y((d) => { 
                                  return y2(d.OD_Salary); }))
                 .attr("stroke", (d) => { return color2("valueA"); })
                 .style("stroke-width", 5)
                 .style("fill", "none");

// initialize circles with first team
circles2 = svg2.selectAll("circle")
                   .data(data.filter((d) => {return d.Team == "ATL"}))
                   .enter()
                   .append("circle")
                   .attr("cx", (d) => { return x2(new Date(d.Season, 0, 1)); })
                   .attr("cy", (d) => { return y2(d.OD_Salary); })
                   .attr("r", 5)
                   .style("fill", (d) => { return color2("valueA"); })
                   .on("mouseover", mouseover2) 
                   .on("mousemove", mousemove2)
                   .on("mouseleave", mouseleave2);


// initialize line label with first team
var od_2018 = data.filter((d) => {return d.Team == "ATL"})[data.filter((d) => {return d.Team == "ATL"}).length - 1].OD_Salary ;
const label2 = svg2.append("text")
              .attr("transform", "translate(" + (x2(new Date(2018, 0, 1)) + 10) + "," + y2(od_2018) + ")")
              .attr("dy", ".35em")
              .attr("text-anchor", "start")
              .style("fill", (d) => { return color2("valueA"); })
              .text(res2[0]);
          
// average OD salary per year line    
// group by the team name
var year_groups = d3.group(data, d => d.Season);
var all_years = Array.from(year_groups.keys());

function get_average(year_str) {
    var yearfilter = year_groups.get(year_str);
    totalsalary = 0;

    for (var i = 0; i < yearfilter.length; i++) {
      // add total salary up
      totalsalary = totalsalary + (+yearfilter[i].OD_Salary) ;
    }
    return +(totalsalary / yearfilter.length) ; }; 


// create a dataset of years and averages
var all_year_average = [] ;
var year_average = {} ;

for (var i = 0; i < all_years.length; i++) { // for every year...
  // select that year
  year = all_years[i];

  // create a dictionary for that year
  year_average["year"] = year ; 
  year_average["average"] = get_average(year) ;

  // add that dictionary to all_year_average
  all_year_average.push(year_average) ; 

  // clear year_average
  year_average = {} ; 
} ;
console.log(all_year_average) ; 

// set the average line
const avg_line = svg2.append('g')
                 .append("path")
                 .datum(all_year_average)
                 .attr("d", d3.line()
                                .x((d) => { return x2(new Date(+d.year, 0, 1)); })
                                .y((d) => { return y2(d.average); }))
                 .attr("stroke", "black")
                 .style("stroke-width", 1.5)
                 .style("fill", "none")
                 .attr("id", "avgline");
        
// initialize line label for average line
const avg_label = svg2.append("text")
              .attr("transform", "translate(" + (x2(new Date(2018, 0, 1)) + 10) + "," + y2(get_average('2018')) + ")")
              .attr("dy", ".35em")
              .attr("text-anchor", "start")
              .style("fill", "black")
              .text("avg.")
              .attr("id", "avgline_label");;
              
let salary_button = document.querySelector('#salaryButton');

// add event listener to toggle the average salary line
salary_button.addEventListener('click', () => {
     // determine if current line is visible
      var active   = avgline.active ? false : true,
      newOpacity = active ? 0 : 1;
                    
      // hide or show the elements
      d3.select("#avgline").style("opacity", newOpacity);
      d3.select("#avgline_label").style("opacity", newOpacity);
      
      // update whether or not the elements are active
      avgline.active = active;
}) ;
  
                 
// function to update the chart
  function update2(selectedGroup) {
  
    // create new data with the selection
    const dataFilter = data.filter((d) => {
      return d.Team == selectedGroup; } );
  
      // updated line data
      line2
          .datum(dataFilter)
          .attr("d", d3.line()
                        .x((d) => { return x2(new Date(d.Season, 0, 1)); })
                        .y((d) => { return y2(d.OD_Salary); }))
          .attr("stroke", (d) => { return color2(selectedGroup); });
  
      // updated circles data
      circles2 = svg2.selectAll("circle")
                    .data(dataFilter)
                    .enter()
                    .append("circle")
                    .attr("cx", (d) => { return x2(new Date(d.Season, 0, 1)); })
                    .attr("cy", (d) => { return y2(d.OD_Salary); })
                    .attr("r", 5)
                    .style("fill", (d) => { return color2(selectedGroup); })
                    .on("mouseover", mouseover2) 
                    .on("mousemove", mousemove2)
                    .on("mouseleave", mouseleave2);
      // TODO add in transitions for line, circle, label ?
  
      // updated line label data
      od_2018 = dataFilter[dataFilter.length - 1].OD_Salary ; 
      label2
          .attr("transform", "translate(" + (x2(new Date(2018, 0, 1)) + 10) + "," + y2(od_2018) + ")")
          .style("fill", (d) => { return color2(selectedGroup); })
          .text(selectedGroup) ;
    }

    //Define a brush2 
    const brush2 = d3.brush();

    //Add brush2 to svg2
    svg2.append("g").attr("class", "brush")
        .call(brush2.extent( [ [0,0], [width,height] ] )
                    .on("start brush", updateChart2));

  }

  
//Brushing Code---------------------------------------------------------------------------------------------

  // Call to removes existing brushes
  function clear() {
    svg1.append('g')
        .on("start brush", updateChart1)
        .call(brush1.move, null);
    svg2.append('g')
        .on("start brush", updateChart2)
        .call(brush2.move, null);
}

// Call when Scatterplot1 is brushed
function updateChart1(brushEvent) {

  let extent = brushEvent.selection;

  myCircles1.classed("border", (d) => {
    return isBrushed(extent, x1(d[xKey1]), y1(d[yKey1]));
  });



  myCircles2.classed("border", (d) => {
    return isBrushed(extent, x1(d[xKey1]), y1(d[yKey1]));
  });

}

// Call when Scatterplot2 is brushed
function updateChart2(brushEvent) {

  //TODO: Find coordinates of brushed region
  let extent = brushEvent.selection;

  //TODO: Start an empty set that you can store names of selected species in
  var selected_species = new Set()

  //TODO: Give bold outline to all points within the brush region in Scatterplot2 & collected names of brushed species
  
  myCircles2.classed("border", (d) => {
    let brushed = isBrushed(extent, x2(d[xKey2]), y2(d[yKey2]))
    if (brushed) {
      selected_species.add(d[xKey3])
    }
    return brushed
    ;

    clear();
  });


  //TODO: Give bold outline to all points in Scatterplot1 corresponding to points within the brush region in Scatterplot2
  myCircles1.classed("border", (d) => {
    return isBrushed(extent, x2(d[xKey2]), y2(d[yKey2]));
  });

  //TODO: Give bold outline to all bars in bar chart with corresponding to species selected by Scatterplot2 brush
  bar3.classed("border", (d) => {
    return selected_species.has(d[xKey3]);
  })



}

  //Finds dots within the brushed region
  function isBrushed(brush_coords, cx, cy) {
    if (brush_coords === null) return;

    var x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
  }


  // run the update function for both graphs when a new team is selected from dropdown
  d3.select("#selectButton").on("change", function(event,d) {
    // determine the user's selected option
    const selectedOption2 = d3.select(this).property("value")

    // clear all existing circles to add new circles
    circles.remove()
    circles2.remove()
    
    // run both update functions with the user's selection
    update(selectedOption2)
    update2(selectedOption2)
  })

});


// bracket visualization
d3.csv("data/postseason_data.csv").then((data) => {

 { // given a year, assign the AL bracket
  function assignALBracket(year) {
    // filter by the year the user has selected
      yearFilter = data.filter((d) => {return d.Season == +year;});

    // filter the year based on the AL league
      leagueFilter = yearFilter.filter((d) => {return d.League == "AL";});

    // get championship winner
      championship = leagueFilter.filter((d) => {return d.Series_Played == 'Championship'})
          c_winner = championship[0].Winning_Team ; 

    // get the wildcard teams
      wildcard = leagueFilter.filter((d) => {return d.Series_Played == 'Wildcard';});
          wc_winner = wildcard[0].Winning_Team ;
          wc_loser = wildcard[0].Losing_Team ;

    // get the division1 teams
      division1 = leagueFilter.filter((d) => {return d.Series_Played == 'Division1';});
            d1_winner = division1[0].Winning_Team ;
            d1_loser = division1[0].Losing_Team ;
            // not wildcard team
            d1_notwc = (wc_winner == d1_winner) ? d1_loser : d1_winner ;

    // get the division2 teams
        division2 = leagueFilter.filter((d) => {return d.Series_Played == 'Division2';});
              d2_winner = division2[0].Winning_Team ;
          // losing d2 team
              d2_loser = division2[0].Losing_Team ;
                

    // build the bracket with this data
    var bracket = 
      {"name": c_winner,
          "children": 
          [{ "name": d2_winner,
                  "children": 
                  [{ "name": d2_winner},
                   { "name": d2_loser}]},
           { "name": d1_winner,
            "children": 
                [{ "name": d1_notwc}, 
                 { "name": wc_winner, 
                      "children" : 
                          [{ "name": wc_winner},
                           { "name": wc_loser}
                          ]
                 }] 
           }]
      } ;

    return bracket ;  };



// setting up the button
var res = [2018, 2017, 2016, 2015, 2014, 2013, 2012] ; 

// add the options to the button
d3.select("#selectButton2")
  .selectAll('myOptions')
  .data(res)
  .enter()
  .append('option')
  .text((d) => { return d3.format("4")(d); }) 
  .attr("value", (d) => { return d; });

// initialize bracket with first year
var treeData = assignALBracket(2018);
drawTreeAL(treeData)

function drawTreeAL(treeData) {
  var i = 0, duration = 750, root;
 
  // declares a tree layout and assigns the size
  var treemap = d3.tree().size([height, width]); // CHANGE WIDTH TO FIT BOTH BRACKETS ?
   
  // Assigns parent, children, height, depth
  root = d3.hierarchy(treeData, function(d) { return d.children; });
  root.x0 = height / 2;
  root.y0 = 0;

  update3(root);
  
   
  function update3(source) {
   
   // Assigns the x and y position for the nodes
   var treeData = treemap(root);
   
   // Compute the new tree layout.
   var nodes = treeData.descendants(),
       links = treeData.descendants().slice(1);
   
   // Normalize for fixed-depth.
   nodes.forEach(function(d){ d.y = d.depth * 180}); // the distance between parent and child
   
   // ****************** Nodes section ***************************
   // Update the nodes...
   var node = svg3.selectAll('g.node')
       .data(nodes, function(d) {return d.id || (d.id = ++i); });
   
   // Enter any new modes at the parent's previous position.
   var nodeEnter = node.enter().append('g')
       .attr('class', 'node')
       .attr("transform", function(d) {
          return "translate(" + (width*0.95 - source.y0) + "," + source.x0 + ")"; // CHANGED FOR AL BRACKET
     })
     .on('click', click);
   
   // Add Circle for the nodes
   nodeEnter.append('circle')
       .attr('class', 'node')
       .attr('r', 1e-6)
       .style("fill", function(d) {
           return d._children ? "lightsteelblue" : "#fff";
       });
   
   // Add labels for the nodes
   nodeEnter.append('text')
       .attr("dy", ".35em")
       .attr("x", function(d) { return d.children || d._children ? 40 : -10 ; })
       .attr("y", function(d) { return d.children || d._children ? -20 : 20; })
       .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
       .text(function(d) {
         return d.data.name; });
   
   // UPDATE
   var nodeUpdate = nodeEnter;
   
   // Transition to the proper position for the node
   nodeUpdate.transition()
     .duration(duration)
     .attr("transform", function(d) {
         return "translate(" + (width*0.95 - d.y) + "," + d.x + ")";  // CHANGED FOR AL GRAPH
      });
   
   // Update the node attributes and style
   nodeUpdate.select('circle.node')
     .attr('r', 10)
     .style("fill", function(d) {
         return d._children ? "lightsteelblue" : "#fff";
     })
     .attr('cursor', 'pointer');
   
  
   
   // ****************** links section **************************
   
   
   // Update the links...
   var link = svg3.selectAll('path.link')
                  .data(links, function(d) { return d.id; });
   
   // Enter any new links at the parent's previous position.
   var linkEnter = link.enter().insert('path', "g")
       .attr("class", "link")
       .attr('d', function(d){
         var o = {x: source.x0, y: source.y0}
         return diagonal(o, o)
       });
   
   // UPDATE
   var linkUpdate = linkEnter;
   
   // Transition back to the parent element position
   linkUpdate.transition()
       .duration(duration)
       .attr('d', function(d){ return diagonal(d, d.parent) });
   
  
   // Creates a bracket path from parent to the child nodes
   function diagonal(s, d) {
  
     path = (`M ${(width*0.95 - s.y)} ${s.x}
             C ${((width*0.95 - s.y) + (width*0.95 - d.y)) / 2} ${s.x},
               ${((width*0.95 - s.y) + (width*0.95 - d.y)) / 2} ${d.x},
               ${width*0.95 - d.y} ${d.x}`).replace('C', 'L')
     
     return path
   };
  
   // Toggle children on click.
   function click(event, d) {
     if (d.children) {
         d._children = d.children;
         d.children = null;
       } else {
         d.children = d._children;
         d._children = null;
       }
     update3(d);
   }
  }
}

// given a year, assign the NL bracket
function assignNLBracket(year) {
  // filter by the year the user has selected
    yearFilter = data.filter((d) => {return d.Season == +year;});

  // filter the year based on the NL league
    leagueFilterNL = yearFilter.filter((d) => {return d.League == "NL";});

  // get championship winner
    championship = leagueFilterNL.filter((d) => {return d.Series_Played == 'Championship'})
        c_winner = championship[0].Winning_Team ; 

  // get the wildcard teams
    wildcard = leagueFilterNL.filter((d) => {return d.Series_Played == 'Wildcard';});
        wc_winner = wildcard[0].Winning_Team ;
        wc_loser = wildcard[0].Losing_Team ;

  // get the division1 teams
    division1 = leagueFilterNL.filter((d) => {return d.Series_Played == 'Division1';});
          d1_winner = division1[0].Winning_Team ;
          d1_loser = division1[0].Losing_Team ;
          // not wildcard team
          d1_notwc = (wc_winner == d1_winner) ? d1_loser : d1_winner ;

  // get the division2 teams
      division2 = leagueFilterNL.filter((d) => {return d.Series_Played == 'Division2';});
            d2_winner = division2[0].Winning_Team ;
        // losing d2 team
            d2_loser = division2[0].Losing_Team ;
              

  // build the bracket with this data
  var bracketNL = 
    {"name": c_winner,
        "children": 
        [{ "name": d2_winner,
                "children": 
                [{ "name": d2_winner},
                 { "name": d2_loser}]},
         { "name": d1_winner,
          "children": 
              [{ "name": d1_notwc}, 
               { "name": wc_winner, 
                    "children" : 
                        [{ "name": wc_winner},
                         { "name": wc_loser}
                        ]
               }] 
         }]
    } ;

  return bracketNL ;  };

// initialize bracket with first year
var treeDataNL = assignNLBracket(2018);
drawTreeNL(treeDataNL)

function drawTreeNL(treeDataNL) {
var i = 0, duration = 750, root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);
 
// Assigns parent, children, height, depth
root = d3.hierarchy(treeDataNL, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;
 
update4(root);
 
function update4(source) {
 
 // Assigns the x and y position for the nodes
 var treeDataNL = treemap(root);
 
 // Compute the new tree layout.
 var nodes = treeDataNL.descendants(),
     links = treeDataNL.descendants().slice(1);
 
 // Normalize for fixed-depth.
 nodes.forEach(function(d){ d.y = d.depth * 180});
 
 // ****************** Nodes section ***************************
 
 // Update the nodes...
 var node = svg4.selectAll('g.node')
     .data(nodes, function(d) {return d.id || (d.id = ++i); });
 
 // Enter any new modes at the parent's previous position.
 var nodeEnter = node.enter().append('g')
     .attr('class', 'node')
     .attr("transform", function(d) {
       return "translate(" + (60 + source.y0) + "," + source.x0 + ")";
   })
   .on('click', click);
 
 // Add Circle for the nodes
 nodeEnter.append('circle')
     .attr('class', 'node')
     .attr('r', 1e-6)
     .style("fill", function(d) {
         return d._children ? "lightsteelblue" : "#fff";
     });
 
 // Add labels for the nodes
 nodeEnter.append('text')
     .attr("dy", ".35em")
     .attr("x", function(d) { return d.children || d._children ? 60 : -10 ; })
     .attr("y", function(d) { return d.children || d._children ? -20 : 20; })
     .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
     .text(function(d) {
       return d.data.name; });
 
 // UPDATE
 var nodeUpdate = nodeEnter;
 
 // Transition to the proper position for the node
 nodeUpdate.transition()
   .duration(duration)
   .attr("transform", function(d) {
       return "translate(" + (60 + d.y) + "," + d.x + ")";
    });
 
 // Update the node attributes and style
 nodeUpdate.select('circle.node')
   .attr('r', 10)
   .style("fill", function(d) {
       return d._children ? "lightsteelblue" : "#fff";
   })
   .attr('cursor', 'pointer');
 
 
 
 
 // ****************** links section **************************
 
 
 // Update the links...
 var link = svg4.selectAll('path.link')
                .data(links, function(d) { return d.id; });
 
 // Enter any new links at the parent's previous position.
 var linkEnter = link.enter().insert('path', "g")
     .attr("class", "link")
     .attr('d', function(d){
       var o = {x: source.x0, y: source.y0}
       return diagonal(o, o)
     });
 
 // UPDATE
 var linkUpdate = linkEnter;
 
 // Transition back to the parent element position
 linkUpdate.transition()
     .duration(duration)
     .attr('d', function(d){ return diagonal(d, d.parent) });
 
 // Creates a bracket path from parent to the child nodes
 function diagonal(s, d) {

   path = (`M ${(60 + s.y)} ${s.x}
           C ${((60 + s.y) + (60 + d.y)) / 2} ${s.x},
             ${((60 + s.y) + (60 + d.y)) / 2} ${d.x},
             ${(60 + d.y)} ${d.x}`).replace('C', 'L')
   
   return path
 };

 // Toggle children on click.
 function click(event, d) {
   if (d.children) {
       d._children = d.children;
       d.children = null;
     } else {
       d.children = d._children;
       d._children = null;
     }
   update4(d);
 }
}
}

// button functionality
// function to update the chart
function update(selectedYear) {

  // create new tree with selected year
  treeData = assignALBracket(selectedYear) ; 
  // create new tree with selected year
  treeDataNL = assignNLBracket(selectedYear) ; 

  // draw new tree
  drawTreeAL(treeData) ; 
  // draw new tree
  drawTreeNL(treeDataNL) ;
}

// run the update function for both graphs when a new team is selected from dropdown
d3.select("#selectButton2").on("change", function(event,d) {
  // determine the user's selected option
  const selectedOption = d3.select(this).property("value") ; 

  // clear all elements from the svg
  svg3.selectAll('g.node').remove();
  svg3.selectAll('path.link').remove();
  // clear all elements from the svg
  svg4.selectAll('g.node').remove();
  svg4.selectAll('path.link').remove();
  
  // run both update functions with the user's selection
  update(selectedOption) ; 
})


}
});


