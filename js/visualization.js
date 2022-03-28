
// set margins and dimensions 
const margin = { top: 50, right: 50, bottom: 50, left: 200 };
const width = 900; //- margin.left - margin.right;
const height = 650; //- margin.top - margin.bottom;

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
  let x1,y1;
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
                   //make sure graph has x-axis label **
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
                    .text(yKey1)
    );

    // add the lines
    // currently adds one line for ATL
    svg1.append("path")
      .datum(data.filter((d) => { return d.Team == "ATL"; }))
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
                  .x((d) => { return x1(new Date(d.Season, 0, 1)); })
                  .y((d) => { return y1(d.Success_Score); })
            ) 
  }


   


});