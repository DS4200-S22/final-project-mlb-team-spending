
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

// append svg object to house OD Salary Line Graph
const svg2 = d3.select("#vis-container")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]);

// append svg object to house bracket
const svg3 = d3.select("#vis-container2")
                .append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate("+ margin.left + "," + margin.top + ")") ;

// upload data
d3.csv("data/final_mlb_data.csv").then((data) => {
  
  // print first 10 rows of data to the console
  for (var i = 0; i < 10; i++) {
    console.log(data[i]);}

  // initialize variables
  let x1, y1, x2, y2;
  let xKey1, yKey1, xKey2, yKey2;
  let circles, circles2;
  let brush1, brush2;
  
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
    // TODO location of selectButton?

  // setting the color for each team (hex codes from the teams)
  const color = d3.scaleOrdinal()
    .domain(res)
    .range(['#CE1141','#DF4601', '#BD3039', '#0E3386', '#27251F', 
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
  tooltip2.html("Year: " + d.Season + "<br> OD Salary: " + currency(+d.OD_Salary) + "<br")
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
var res2 = Array.from(sumstat2.keys());

  // setting the color for each team (hex codes from the teams)
  const color2 = d3.scaleOrdinal()
    .domain(res2)
    .range(['#CE1141','#DF4601', '#BD3039', '#0E3386', '#27251F', 
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


// DATA FOR BRACKET
d3.csv("data/postseason_data.csv").then((data) => {

    // print first 10 rows of data to the console
  for (var i = 0; i < 10; i++) {
    console.log(data[i]);}

  // given a year, assign the AL bracket
  function assignALBracket(year) {
    // filter by the year the user has selected
      yearFilter = data.filter((d) => {return d.Season == year;});

    // get the AL team who played in the world series
      seriesFilter = yearFilter.filter((d) => {return d.Series_Played == 'WorldSeries';});
      win_in_al = seriesFilter[0].AL_Win ; 

      // winning ws team
      ws_winner = seriesFilter[0].Winning_Team ; 
      ws_loser = seriesFilter[0].Losing_Team ;

      al_ws_team = (win_in_al == true) ? ws_winner : ws_loser ;

    // filter the year based on the AL league
      leagueFilter = yearFilter.filter((d) => {return d.League == "AL";});

    // get the wildcard teams
      wildcard = leagueFilter.filter((d) => {return d.Series_Played == 'Wildcard';});
        // winning wildcard team
          wc_winner = wildcard[0].Winning_Team ;
        // losing wildcard team
          wc_loser = wildcard[0].Losing_Team ;

    // get the division1 teams
      division1 = leagueFilter.filter((d) => {return d.Series_Played == 'Division1';});
        // winning d1 team
            d1_winner = division1[0].Winning_Team ;
        // losing d1 team
            d1_loser = division1[0].Losing_Team ;
        // non-wildcard team
            d1_notwc = (wc_winner == d1_winner) ? d1_loser : d1_winner ;

    // get the division2 teams
        division2 = leagueFilter.filter((d) => {return d.Series_Played == 'Division2';});
          // winning d2 team
              d2_winner = division2[0].Winning_Team ;
          // losing d2 team
              d2_loser = division2[0].Losing_Team ;
                

    // build the bracket with this data
    var bracket = 
      {"name": al_ws_team,
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

console.log(assignALBracket(2018));

var treeData = assignALBracket(2018);


var i = 0, duration = 750, root;
 
// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);
 
// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;
console.log("rootx0: "+root.x0);
 
 
update3(root);
 
// Collapse the node and all it's children
function collapse(d) {
 if(d.children) {
   d._children = d.children
   d._children.forEach(collapse)
   d.children = null
 }
}
 
function update3(source) {
 
 // Assigns the x and y position for the nodes
 var treeData = treemap(root);
 
 // Compute the new tree layout.
 var nodes = treeData.descendants(),
     links = treeData.descendants().slice(1);
 
 // Normalize for fixed-depth.
 nodes.forEach(function(d){ d.y = d.depth * 180});
 
 // ****************** Nodes section ***************************
 
 // Update the nodes...
 var node = svg3.selectAll('g.node')
     .data(nodes, function(d) {return d.id || (d.id = ++i); });
 
 // Enter any new modes at the parent's previous position.
 var nodeEnter = node.enter().append('g')
     .attr('class', 'node')
     .attr("transform", function(d) {
       //console.log(source.y0)
       //console.log(source.x0)
       return "translate(" + source.y0 + "," + source.x0 + ")";
   })
   .on('click', click);
 
 // Add Circle for the nodes
 nodeEnter.append('circle')
     .attr('class', 'node')
     .attr('r', 1e-6)
     .style("fill", function(d) {
         //console.log(d._children)
         return d._children ? "lightsteelblue" : "#fff";
     });
 
 // Add labels for the nodes
 nodeEnter.append('text')
     .attr("dy", ".35em")
     .attr("x", function(d) { return d.children || d._children ? 5 : -10 ; })
     .attr("y", function(d) { return d.children || d._children ? -20 : 20; })
     .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
     .text(function(d) {
       //console.log("data name: " + d.data.name )
       return d.data.name; });
 
 // UPDATE
 var nodeUpdate = nodeEnter.merge(node);
 
 // Transition to the proper position for the node
 nodeUpdate.transition()
   .duration(duration)
   .attr("transform", function(d) {
       return "translate(" + d.y + "," + d.x + ")";
    });
 
 // Update the node attributes and style
 nodeUpdate.select('circle.node')
   .attr('r', 10)
   .style("fill", function(d) {
       return d._children ? "lightsteelblue" : "#fff";
   })
   .attr('cursor', 'pointer');
 
 
 // Remove any exiting nodes
 var nodeExit = node.exit().transition()
     .duration(duration)
     .attr("transform", function(d) {
         return "translate(" + source.y + "," + source.x + ")";
     })
     .remove();
 
 // On exit reduce the node circles size to 0
 nodeExit.select('circle')
   .attr('r', 1e-6);
 
 // On exit reduce the opacity of text labels
 nodeExit.select('text')
   .style('fill-opacity', 1e-6);
 
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
 var linkUpdate = linkEnter.merge(link);
 
 // Transition back to the parent element position
 linkUpdate.transition()
     .duration(duration)
     .attr('d', function(d){ return diagonal(d, d.parent) });
 
 // Store the old positions for transition.
 nodes.forEach(function(d){
   d.x0 = d.x;
   d.y0 = d.y;
 });
 
 // Creates a bracket path from parent to the child nodes
 function diagonal(s, d) {

   path = (`M ${s.y} ${s.x}
           C ${(s.y + d.y) / 2} ${s.x},
             ${(s.y + d.y) / 2} ${d.x},
             ${d.y} ${d.x}`).replace('C', 'L')
   
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












});





