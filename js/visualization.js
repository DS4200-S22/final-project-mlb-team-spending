
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

// initialize the brush for the success score line graph
let brush1; 

// append svg object to house OD Salary Line Graph
const svg2 = d3.select("#vis-container")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]);

// initialize the brush for the OD salary line graph
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
  let sumstat = d3.group(data, d => d.Team);

  // list of group names
  let res = Array.from(sumstat.keys());

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

// define brush 1
brush1 = d3.brush();

// add brush 1 to svg
svg1.append("g")
    .attr("class", "brush")
    .call(brush1.extent( [ [0,0], [width,height] ] )
                .on("start brush", updateChart1));

// initialize line label with first team
let success_2018 = data.filter((d) => {return d.Team == "ATL"})[data.filter((d) => {return d.Team == "ATL"}).length - 1].Success_Score ;
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
let sumstat2 = d3.group(data, d => d.Team);

// list of group names
let res2= Array.from(sumstat2.keys());

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

  // define brush 2
  brush2 = d3.brush();

  // add brush 2 to svg
  svg2.append("g").attr("class", "brush")
      .call(brush2.extent( [ [0,0], [width,height] ] )
                  .on("start brush", updateChart2));


// initialize line label with first team
let od_2018 = data.filter((d) => {return d.Team == "ATL"})[data.filter((d) => {return d.Team == "ATL"}).length - 1].OD_Salary ;
const label2 = svg2.append("text")
              .attr("transform", "translate(" + (x2(new Date(2018, 0, 1)) + 10) + "," + y2(od_2018) + ")")
              .attr("dy", ".35em")
              .attr("text-anchor", "start")
              .style("fill", (d) => { return color2("valueA"); })
              .text(res2[0]);
          
// average OD salary per year line    
// group by the team name
let year_groups = d3.group(data, d => d.Season);
let all_years = Array.from(year_groups.keys());

function get_average(year_str) {
    let yearfilter = year_groups.get(year_str);
    totalsalary = 0;

    for (let i = 0; i < yearfilter.length; i++) {
      // add total salary up
      totalsalary = totalsalary + (+yearfilter[i].OD_Salary) ;
    }
    return +(totalsalary / yearfilter.length) ; }; 


// create a dataset of years and averages
let all_year_average = [] ;
let year_average = {} ;

for (let i = 0; i < all_years.length; i++) { // for every year...
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
      let active   = avgline.active ? false : true,
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
  }

  
// brushing and linking code ------------------------------------------------------------------------------------

  // remove existing brushes from the page
  function clear() {
    svg1.append('g')
        .on("start brush", updateChart1)
        .call(brush1.move, null);
    svg2.append('g')
        .on("start brush", updateChart2)
        .call(brush2.move, null);
}

// call when success score line graph is brushed
function updateChart1(brushEvent) {

  let extent = brushEvent.selection;

  circles.classed("border", (d) => {
    return isBrushed(extent, x1(new Date(d.Season, 0, 1)), y1(d.Success_Score));

  });
  
  circles2.classed("border", (d) => {
    return isBrushed(extent, x1(new Date(d.Season, 0, 1)), y1(d.Success_Score));
  });

  clear();
};

// call when OD salary line graph is brushed
function updateChart2(brushEvent) {

  let extent = brushEvent.selection;
  
  circles2.classed("border", (d) => {
    return isBrushed(extent, x2(new Date(d.Season, 0, 1)), y2(d.OD_Salary)); 
   });

   circles.classed("border", (d) => {
    return isBrushed(extent,  x2(new Date(d.Season, 0, 1)), y2(d.OD_Salary));
  });

    clear();
};

  // finds the dots in the brushed region
  function isBrushed(brush_coords, cx, cy) {
    if (brush_coords === null) return;

    let x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
  };

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

  // dictionary for team names and abbreviations
  let team_abbreviations = {
    'Arizona Diamondbacks' : 'ARI',
    'Atlanta Braves' : 'ATL',
    'Baltimore Orioles' : 'BAL',
    'Boston Red Sox' : 'BOS',
    'Chicago Cubs' : 'CHC',
    'Chicago White Sox' : 'CHW',
    'Cincinnati Reds' : 'CIN',
    'Cleveland Indians' : 'CLE',
    'Colorado Rockies' : 'COL',
    'Detroit Tigers' : 'DET',
    'Houston Astros' : 'HOU',
    'Kansas City Royals' : 'KCR',
    'Los Angeles Angels' : 'LAA',
    'Los Angeles Dodgers' : 'LAD',
    'Miami Marlins' : 'MIA',
    'Milwaukee Brewers' : 'MIL',
    'Minnesota Twins' : 'MIN',
    'New York Mets' : 'NYM',
    'New York Yankees' : 'NYY',
    'Oakland Athletics' : 'OAK',
    'Philadelphia Phillies' : 'PHI',
    'Pittsburgh Pirates' : 'PIT',
    'San Diego Padres' : 'SDP',
    'Seattle Mariners' : 'SEA',
    'San Francisco Giants' : 'SFG',
    'St. Louis Cardinals' : 'STL',
    'Tampa Bay Rays' : 'TBR',
    'Texas Rangers' : 'TEX',
    'Toronto Blue Jays' : 'TOR',
    'Washington Nationals' : 'WSN' };

  // add color scale for the gradient scale
  const gradient = d3.scaleLinear()
        .range(["white", "#003887"])
        .domain([0, 224021260]) ; 

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
    let bracket = 
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
let res = [2018, 2017, 2016, 2015, 2014, 2013, 2012] ; 

// add the options to the button
d3.select("#selectButton2")
  .selectAll('myOptions')
  .data(res)
  .enter()
  .append('option')
  .text((d) => { return d3.format("4")(d); }) 
  .attr("value", (d) => { return d; });

// initialize bracket with first year
let treeData = assignALBracket(2018);
drawTreeAL(treeData)

function drawTreeAL(treeData) {
  let i = 0, duration = 750, root;
 
  // declares a tree layout and assigns the size
  let treemap = d3.tree().size([height, width]);
   
  // assigns parent, children, height, depth
  root = d3.hierarchy(treeData, function(d) { return d.children; });
  root.x0 = height / 2;
  root.y0 = 0;

  update3(root);
  
  // update the AL bracket
  function update3(source) {
   
   // assigns the x and y position for the nodes
   let treeData = treemap(root);
   
   // compute the new tree layout
   let nodes = treeData.descendants(),
       links = treeData.descendants().slice(1);
   
   // normalize for fixed-depth
   nodes.forEach(function(d){ d.y = d.depth * 180});
   
   // AL nodes section -------------------------------------------------------------------------------
   
   // update the nodes
   let node = svg3.selectAll('g.node')
       .data(nodes, function(d) {return d.id || (d.id = ++i); });
   
   // enter any new modes at the parent's previous position
   let nodeEnter = node.enter().append('g')
       .attr('class', 'node')
       .attr("transform", function(d) {
          return "translate(" + (width*0.95 - source.y0) + "," + source.x0 + ")"; })
     .on('click', click);
   
   // add a circle for the nodes
   nodeEnter.append('circle')
       .attr('class', 'node')
       .attr('r', 1e-6);
   
   // add labels for the nodes
   nodeEnter.append('text')
       .attr("dy", ".35em")
       .attr("x", function(d) { return d.children || d._children ? 40 : -40 ; })
       .attr("y", function(d) { return d.children || d._children ? -45 : -45; })
       .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
       .text(function(d) {
         return d.data.name; });
   
   // UPDATE
   let nodeUpdate = nodeEnter;
   
   // transition to the proper position for the node
   nodeUpdate.transition()
     .duration(duration)
     .attr("transform", function(d) {
         return "translate(" + (width*0.95 - d.y) + "," + d.x + ")";  // CHANGED FOR AL GRAPH
      });

      // read in the general data to determine OD salary of the nodes for the heatmap
      d3.csv("data/final_mlb_data.csv").then((data2) => {

        // update the node attributes and style
        nodeUpdate.select('circle.node')
                  .attr('r', 30)
                  .style("fill", (d) => {
                    // filter the data to get the OD Salary
                    gradient_filter = data2.filter((d2) => {
                      return (d2.Season == yearAL && d2.Team == team_abbreviations[d.data.name]) });
                    gradient_salary = gradient_filter[0].OD_Salary
                    
                    return gradient(gradient_salary); })
                  .attr('cursor', 'pointer');
      });

  
   
   // AL links section --------------------------------------------------------------------------------
   
   // update the links
   let link = svg3.selectAll('path.link')
                  .data(links, function(d) { return d.id; });
   
   // enter any new links at the parent's previous position
   let linkEnter = link.enter().insert('path', "g")
       .attr("class", "link")
       .attr('d', function(d){
         let o = {x: source.x0, y: source.y0}
         return diagonal(o, o)
       });
   
   // UPDATE
   let linkUpdate = linkEnter;
   
   // transition back to the parent element position
   linkUpdate.transition()
       .duration(duration)
       .attr('d', function(d){ return diagonal(d, d.parent) });
   
  
   // creates a bracket path from parent to the child nodes
   function diagonal(s, d) {
  
     path = (`M ${(width*0.95 - s.y)} ${s.x}
             C ${((width*0.95 - s.y) + (width*0.95 - d.y)) / 2} ${s.x},
               ${((width*0.95 - s.y) + (width*0.95 - d.y)) / 2} ${d.x},
               ${width*0.95 - d.y} ${d.x}`).replace('C', 'L')
     
     return path
   };
  
   // toggle children on click
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

// NL bracket ----------------------------------------------------------------------------------------

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
  let bracketNL = 
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
let yearAL = 2018 ; 
let treeDataNL = assignNLBracket(yearAL);
drawTreeNL(treeDataNL)

function drawTreeNL(treeDataNL) {
let i = 0, duration = 750, root;

// declares a tree layout and assigns the size
let treemap = d3.tree().size([height, width]);
 
// Assigns parent, children, height, depth
root = d3.hierarchy(treeDataNL, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;
 
update4(root);
 
function update4(source) {
 
 // assigns the x and y position for the nodes
 let treeDataNL = treemap(root);
 
 // compute the new tree layout
 let nodes = treeDataNL.descendants(),
     links = treeDataNL.descendants().slice(1);
 
 // normalize for fixed-depth
 nodes.forEach(function(d){ d.y = d.depth * 180});
 
 // NL nodes section ---------------------------------------------------------------------------------------
 
 // update the nodes
 let node = svg4.selectAll('g.node')
     .data(nodes, function(d) {return d.id || (d.id = ++i); });
 
 // enter any new modes at the parent's previous position
 let nodeEnter = node.enter().append('g')
     .attr('class', 'node')
     .attr("transform", function(d) {
       return "translate(" + (60 + source.y0) + "," + source.x0 + ")";
   })
   .on('click', click);
 
 // add circle for the nodes
 nodeEnter.append('circle')
     .attr('class', 'node')
     .attr('r', 1e-6);
 
 // add labels for the nodes
 nodeEnter.append('text')
     .attr("dy", ".35em")
     .attr("x", function(d) { return d.children || d._children ? 60 : -35 ; })
     .attr("y", function(d) { return d.children || d._children ? -45 : -45; }) 
     .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
     .text(function(d) {
       return d.data.name; });
 
 // UPDATE
 let nodeUpdate = nodeEnter;
 
 // transition to the proper position for the node
 nodeUpdate.transition()
   .duration(duration)
   .attr("transform", function(d) {
       return "translate(" + (60 + d.y) + "," + d.x + ")";
    });


 // read in the general data to determine the OD salary of the nodes for the heatmap
  d3.csv("data/final_mlb_data.csv").then((data2) => {

    // update the node attributes and style
    nodeUpdate.select('circle.node')
              .attr('r', 30)
              .style('fill', (d) => {
                // filter the data to get the OD Salary
                gradient_filter = data2.filter((d2) => {
                  return (d2.Season == yearAL && d2.Team == team_abbreviations[d.data.name]) });
                gradient_salary = gradient_filter[0].OD_Salary
                
                return gradient(gradient_salary); })
                .attr('cursor', 'pointer');
  });
 
 // NL links section ---------------------------------------------------------------------------------
 
 // update the links
 let link = svg4.selectAll('path.link')
                .data(links, function(d) { return d.id; });
 
 // enter any new links at the parent's previous position
 let linkEnter = link.enter().insert('path', "g")
     .attr("class", "link")
     .attr('d', function(d){
       let o = {x: source.x0, y: source.y0}
       return diagonal(o, o)
     });
 
 // UPDATE
 let linkUpdate = linkEnter;
 
 // transition back to the parent element position
 linkUpdate.transition()
     .duration(duration)
     .attr('d', function(d){ return diagonal(d, d.parent) });
 
 // creates a bracket path from parent to the child nodes
 function diagonal(s, d) {

   path = (`M ${(60 + s.y)} ${s.x}
           C ${((60 + s.y) + (60 + d.y)) / 2} ${s.x},
             ${((60 + s.y) + (60 + d.y)) / 2} ${d.x},
             ${(60 + d.y)} ${d.x}`).replace('C', 'L')
   
   return path
 };

 // toggle children on click.
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
};
};

// button functionality for the bracket graph

// function to update the chart
function update(selectedYear) {

  // create new AL tree with selected year
  treeData = assignALBracket(selectedYear) ; 
  yearAL = selectedYear ; 
  // create new NL tree with selected year
  treeDataNL = assignNLBracket(selectedYear) ; 

  // draw new tree
  drawTreeAL(treeData) ; 
  // draw new tree
  drawTreeNL(treeDataNL) ;
};

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
});


}
});


