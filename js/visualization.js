<<<<<<< Updated upstream
//This is filler -- delete it and start coding your visualization tool here
d3.select("#vis-container")
  .append("text")
  .attr("x", 20)
  .attr("y", 20)
  .text("Hello World!");
=======

// set margins and dimensions 
const margin = { top: 50, right: 50, bottom: 50, left: 200 };
const width = 900; //- margin.left - margin.right;
const height = 650; //- margin.top - margin.bottom;
const yTooltipOffset = 15; 

/*

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
                 // TODO label the lines with the team

// initialize circles with first team
const circles = svg1.selectAll("circle")
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
              // need the correct transform/translate
              .attr("transform", "translate(" + (x1(new Date(2018, 0, 1)) + 15) + "," + y1(success_2018) + ")")
              //.attr("transform", "translate(" + (width+3) + "," + y(data[0].open) + ")")
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
        .transition()
        .duration(1000)
        .attr("d", d3.line()
                      .x((d) => { return x1(new Date(d.Season, 0, 1)); })
                      .y((d) => { return y1(d.Success_Score); }))
        .attr("stroke", (d) => { return color(selectedGroup); });

    // updated circles data
    circles
        .data(dataFilter)
        .transition()
        .duration(1000)
        .attr("cx", (d) => { return x1(new Date(d.Season, 0, 1)); })
        .attr("cy", (d) => { return y1(d.Success_Score); })
        .attr("r", 5)
        .style("fill", (d) => { return color(selectedGroup); });

    // updated line label data
    success_2018 = dataFilter[dataFilter.length - 1].Success_Score ; 
    label
        .attr("transform", "translate(" + (x1(new Date(2018, 0, 1)) + 15) + "," + y1(success_2018) + ")")
        .style("fill", (d) => { return color(selectedGroup); })
        .text(selectedGroup) ;

  }

  // run the update function when a new team is selected
  d3.select("#selectButton").on("change", function(event,d) {
    // determine the user's selected option
    const selectedOption = d3.select(this).property("value")
    
    // run the update function with the user's selection
    update(selectedOption)})

  }

  */

  var treeData =
  {
    "name": "Red Sox",
    "children": [
      { 
        "name": "Yankees",
        "children": [
          { "name": "Orioles" },
          { "name": "Yankees" }
        ]
      },
      {  "name": "Red Sox",
      "children": [
        { "name": "Red Sox" },
        { "name": "A's" }
      ] }
    ]
  };

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg2 = d3.select("#vis-container").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate("
          + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

// Collapse after the second level
//root.children.forEach(collapse);

update(root);

// Collapse the node and all it's children
function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update(source) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);

  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(function(d){ d.y = d.depth * 180});

  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = svg2.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        console.log(source.y0)
        console.log(source.x0)
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
      .attr("x", function(d) {
          return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { 
        console.log("data name: " + d.data.name )
        return d.data.name; });
/*
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

*/
  

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
  var link = svg2.selectAll('path.link')
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

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {

    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  // Toggle children on click.
  function click(event, d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    update(d);
  }
}



/*

  {
    const getChildren = function(d){
      var a = [];
      if(d.winners) for(var i = 0; i < d.winners.length; i++){
        d.winners[i].isRight = false;
        d.winners[i].parent = d;
        a.push(d.winners[i]);
      }
      if(d.challengers) for(var i = 0; i < d.challengers.length; i++){
        d.challengers[i].isRight = true;
        d.challengers[i].parent = d;
        a.push(d.challengers[i]);
      }
      console.log(d.challengers[i].isRight)
      console.log(d.challengers[i].parent)
      console.log(a.length)
      return a.length?a:null;
    }
    ;

const tree = d3.tree()
    .size([height, width])
    ;

const diagonal = function link(d) {
      return "M" + d.source.y + "," + d.source.x
          + "C" + (d.source.y + d.target.y) / 2 + "," + d.source.x
          + " " + (d.source.y + d.target.y) / 2 + "," + d.target.x
          + " " + d.target.y + "," + d.target.x;
    };
const elbow = function (d, i){
      const source = calcLeft(d.source);
      const target = calcLeft(d.target);
      const hy = (target.y-source.y)/2;
      if(d.isRight) hy = -hy;
      return "M" + source.y + "," + source.x
             + "H" + (source.y+hy)
             + "V" + target.x + "H" + target.y;
    };
const connector = elbow;

const calcLeft = function(d){
  const l = d.y;
  if(!d.isRight){
    l = d.y-halfWidth;
    l = halfWidth - l;
  }
  return {x : d.x, y : l};
};



// append svg object to the body of the page to house Success Score Line Graph
const svg2 = d3.select("#vis-container")
                .append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.json("js/bracket.json").then((json) => {
  root = json;
  root.x0 = height / 2;
  root.y0 = width / 2;
  halfWidth = width/2
  
  const t1 = d3.tree().size([height, halfWidth]).children((d) => {return d.winners;}),
      t2 = d3.tree().size([height, halfWidth]).children((d) => {return d.challengers;});
      t1.nodes(root);
      t2.nodes(root);
  
  const rebuildChildren = function(node){
    node.children = getChildren(node);
    if(node.children) node.children.forEach(rebuildChildren);
  }
  rebuildChildren(root);
  root.isRight = false;
  update(root);
});

const toArray = function(item, arr){
  arr = arr || [];
  var i = 0, l = item.children?item.children.length:0;
  arr.push(item);
  for(; i < l; i++){
    toArray(item.children[i], arr);
  }
  return arr;
};

function update(source) {
  // Compute the new tree layout.
  const nodes = toArray(source);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180 + halfWidth; });

  // Update the node
  const node = svg2.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  const nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
        console.log("translate(" + source.y0 + "," + source.x0 + ")");
        return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { 
        console.log(d._children);
        return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
      .attr("dy", function(d) { 
        console.log(d.isRight);
        return d.isRight?14:-8;})
      .attr("text-anchor", "middle")
      .text(function(d) { 
        console.log(d.name);
        return d.name; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  const nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { p = calcLeft(d); return "translate(" + p.y + "," + p.x + ")"; })
      ;

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  const nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { p = calcLeft(d.parent||source); return "translate(" + p.y + "," + p.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links...
  const link = svg2.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return connector({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", connector);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = calcLeft(d.source||source);
        if(d.source.isRight) o.y -= halfWidth - (d.target.y - d.source.y);
        else o.y += halfWidth - (d.target.y - d.source.y);
        return connector({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    var p = calcLeft(d);
    d.x0 = p.x;
    d.y0 = p.y;
  });
  
  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(source);
  }
}

  }

*/ 
//});

>>>>>>> Stashed changes
