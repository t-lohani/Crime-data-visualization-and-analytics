//console.log("Tarun", "Hi there");

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var unemployment = d3.map();

var path = d3.geoPath();

var x = d3.scaleLinear()
    .domain([1, 10])
    .rangeRound([600, 860]);

d3.queue()
    .defer(d3.json, "/crime_db/crime_data")
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .await(makeCharts);

//console.log("Tarun", "Hi there");

function makeCharts(error, crime_data, us_data) {

    if (error) throw error;

//  console.log("Tarun", us_data.objects)
    var crimeByCounty = {};
    var murderByCounty = {};
    var rapeByCounty = {};
    var robberyByCounty = {};
    var assaultByCounty = {};
    var burglaryByCounty = {};
    var larencyByCounty = {};
    var theftByCounty = {};
    var arsonByCounty = {};
    var populationByCounty = {};

    var minCrime = 10000000000;
    var maxCrime = 0;

    crime_data.forEach(function(d) {
        if (d.id < 10000) {
            d.id = "0" + d.id;
        }

        murderByCounty[d.id] = d.MURDER
        rapeByCounty[d.id] = d.RAPE
        robberyByCounty[d.id] = d.ROBBERY
        assaultByCounty[d.id] = d.AGASSLT
        burglaryByCounty[d.id] = d.BURGLRY
        larencyByCounty[d.id] = d.LARCENY
        theftByCounty[d.id] = d.MVTHEFT
        arsonByCounty[d.id] = d.ARSON
        populationByCounty[d.id] = d.POPULATION
        crimeByCounty[d.id] = d.MURDER + d.RAPE + d.ROBBERY + d.AGASSLT +d.BURGLRY + d.LARCENY + d.MVTHEFT + d.ARSON

        if (crimeByCounty[d.id] < minCrime) {
            minCrime = crimeByCounty[d.id]
        }

        if (crimeByCounty[d.id] > maxCrime) {
            maxCrime = crimeByCounty[d.id]
        }
    });

    console.log("Max crime", maxCrime);
    console.log("Min crime", minCrime);

    var color = d3.scaleThreshold()
        .domain(d3.range(minCrime, maxCrime))
        .range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]);

    var g = svg.append("g")
        .attr("class", "key")

    //console.log("Tarun", "Hi there");

    g.selectAll("rect")
      .data(color.range().map(function(d) {
          d = color.invertExtent(d);
          if (d[0] == null) d[0] = x.domain()[0];
          if (d[1] == null) d[1] = x.domain()[1];
          return d;
        }))
      .enter().append("rect")
        .attr("height", 8)
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })
        .attr("fill", function(d) { return color(d[0]); });

    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Unemployment rate");

    g.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat(function(x, i) { return i ? x : x + "%"; })
        .tickValues(color.domain()))
        .select(".domain")
        .remove();

    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us_data, us_data.objects.counties).features)
        .enter().append("path")
//      .attr("fill", function(d) { return color(d.rate = unemployment.get(d.id)); })
//	    .attr("fill", function(d) { console.log("Tarun", d["rate"]);  return 'steelblue' })
        .style("fill", function(d) { return color(crimeByCounty[d.id]); })
        .attr("d", path)
        .append("title")
        .text(function(d) { return murderByCounty[d.id] + " Murders\n" +
                                   rapeByCounty[d.id] + " Rapes\n" +
                                   robberyByCounty[d.id] + " Robberies\n" +
                                   assaultByCounty[d.id] + " Assaults\n" +
                                   burglaryByCounty[d.id] + " Bulglaries\n" +
                                   larencyByCounty[d.id] + " Larencies\n" +
                                   theftByCounty[d.id] + " Thefts\n" +
                                   arsonByCounty[d.id] + " Arsons\n" +
                                   crimeByCounty[d.id] + " Total Crimes\n" +
                                   populationByCounty[d.id] + " Total Population"; });

    svg.append("path")
        .datum(topojson.mesh(us_data, us_data.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("fill", function(d) { return 'steelblue' })
        .attr("d", path);
}

//console.log("Tarun", "End");