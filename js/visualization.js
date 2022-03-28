// Set margins and dimensions 
const margin = { top: 50, right: 50, bottom: 50, left: 200 };
const width = 900; //- margin.left - margin.right;
const height = 650; //- margin.top - margin.bottom;

// Append svg object to the body of the page to house Success Score Line Graph
const svg1 = d3.select("#vis-container")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]);


// Upload data
d3.csv("data/MLB_Data_Cleaned.csv").then((data) => {
  //Print first 10 rows of data 
  for (var i = 0; i < 10; i++) {
    console.log(data[i]);}


  let x1,y1;

  let xKey1, yKey1;
  
  //Success score over seasons line graph 
  {
    xKey1 = 'Season';
    yKey1 = 'Success_Score';

    minX1 = d3.min(data, (d) => { return d[xKey1]; });
    maxX1 = d3.max(data, (d) => { return d[xKey1]; });
    console.log(minX1)
    console.log(maxX1)
    
    
    // Create X scale
    x1 = d3.scaleTime()
            .domain([new Date(minX1, 0, 1), new Date(maxX1, 0, 1)])
            .range([margin.left, width - margin.right]);


     // Add x axis
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
                   //make sure graph has x-axis label
                   );
  
  // Finx max y 
  maxY1 = d3.max(data, (d) => { return d[yKey1]; });

  // Create Y scale
  y1 = d3.scaleLinear()
              .domain([0, maxY1])
              .range([height - margin.bottom, margin.top]); 

  // Add y axis 
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


    // Add the line
    svg1.append("path")
      .datum(data.filter((d) => { return d.Team == "ATL"; }))
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
                  .x((d) => { 
                    console.log(d.Season);
                    return x1(new Date(d.Season, 0, 1)); })
                  .y((d) => { 
                    console.log(d.Success_Score)
                    return y1(d.Success_Score); })
            ) 
  }


   


});