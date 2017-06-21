function donutChart() {

// margin
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 350 - margin.right - margin.left,
    height = 350 - margin.top - margin.bottom,
    radius = width/2;

// color range
var color = d3.scaleOrdinal()
    .range(["#BBDEFB", "#90CAF9", "#0D1C65", "#4F4948"]);


// donut chart arc
var arc2 = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 50);

// arc for the labels position
var labelArc = d3.arc()
    .outerRadius(radius - 20)
    .innerRadius(radius - 40);

// generate pie chart and donut chart
var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.Count; });


// define the svg donut chart
var svg2 = d3.select("#donut-chart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// import data 
d3.csv("assets/data/EmailMarketingCampaign_Data.csv", function(error, data) {

  if (error) throw error;
    
//distinct country
    var country = d3.nest()
        .key(function(d) { return d.Country; })
        .key(function(d) { return d.Clicked; })
        .rollup(function(leaves) { return leaves.length; })
        .entries(data);
    
   // parse data
   country.forEach(function(d,i) {
      d.Country= d.key;
      d.Count= +d.values[0].value;
    });
   //console.log(country);
    

    // "g element is a container used to group other SVG elements"
  var g2 = svg2.selectAll(".arc2")
      .data(pie(country))
    .enter().append("g")
      .attr("class", "arc2");

   // append path 
  g2.append("path")
      .attr("d", arc2)
      .style("fill", function(d) { return color(d.data.Country); })
    .transition()
      .ease(d3.easeLinear)
      .duration(2000)
      .attrTween("d", tweenDonut);


        
   // append text
  g2.append("text")
    .transition()
      .ease(d3.easeLinear)
      .duration(2000)
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.Country; });


      var legendG = svg2.selectAll(".legend")
      .data(pie(country))
      .enter().append("g")
      .attr("transform", function(d,i){
        return "translate(" + (width - 110) + "," + (i * 15 + 20) + ")";
      })
      .attr("class", "legend");   
    
    legendG.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d, i) {
        //return color(i);
        return color(d.data.Country);
      })
      .style('stroke', function(d, i) {
        //return color(i);
        return color(d.data.Country);
      });
    
    legendG.append("text")
      .text(function(d){
        return d.data.Count + "  " + d.data.Country;
      })
      .style("font-size", 12)
      .attr("y", 10)
      .attr("x", 11);

});

  // Helper function for animation of donut chart
  function tweenDonut(b) {
    b.innerRadius = 0;
    var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
    return function(t) { return arc2(i(t)); };
  }
}



//Bar chart
function barChart() {

  var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
  
  //console.log(+svg.attr("width"));
//var tooltip = d3.select("body").append("div").attr("class", "toolTip");
  
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]);

var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("assets/data/EmailMarketingCampaign_Data.csv", function(error, data) {
  	if (error) throw error;
    //distinct campaign
    var campaign = d3.nest()
        .key(function(d) { return d.Campaign; })
        .key(function(d) { return d.Clicked; })
        .rollup(function(leaves) { return leaves.length; })
        .entries(data);
    
   // parse data
   campaign.forEach(function(d,i) {
      d.Campaign= d.key;
      d.Count= +d.values[0].value;
    });
    
   var dd = campaign.filter(function(d){
     if(d.Campaign != 'Unknown'){
       return d;
     }
   });

   //console.log(dd);
   dd.sort(function(a, b) { return a.Count - b.Count; });
  
  	x.domain([0, d3.max(dd, function(d) { return d.Count; })]);
    y.domain(dd.map(function(d) { return d.Campaign; })).padding(0.1);

    g.append("g")
        .attr("class", "x axis")
       	.attr("transform", "translate(0," + height + ")")
      	.call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { 
          console.log(parseInt(d ));
          return parseInt(d ); }).tickSizeInner([-height]));

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    g.selectAll(".bar")
        .data(dd)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.Campaign); })
        .attr("width", function(d) { return x(d.Count); });
      
});
}

