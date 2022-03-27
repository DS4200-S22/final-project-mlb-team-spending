// Set margins and dimensions 
const margin = { top: 50, right: 50, bottom: 50, left: 200 };
const width = 900; //- margin.left - margin.right;
const height = 650; //- margin.top - margin.bottom;

// Append svg object to the body of the page to house Success Score Line Graph
const svg1 = d3.select("#vis-holder")
                .append("svg")
                .attr("width", width - margin.left - margin.right)
                .attr("height", height - margin.top - margin.bottom)
                .attr("viewBox", [0, 0, width, height]);

// Upload data
d3.csv("data/MLB_Data_Cleaned.csv").then((data) => {
  let x1,y1;

  let xKey1, yKey1;
  
  //Success score over seasons line graph 
  {
    xKey1 = 'Season';
    // Success score is (Wins (W)/(Wins (W)+Losses (L)))*100 (in percentage form)

    yKey1 = 'Success Score';

    maxX1 = d3.max(data, (d) => { return d[xKey1]; });
    
    console.log(maxX1);

    // Create X scale
    x1 = d3.scaleLinear()
                .domain([0,maxX1])
                .range([margin.left, width-margin.right]);

  }
   


});