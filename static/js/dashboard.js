var squareLoadings
var eigenValues
var pcaData
var mdsData

var crimeReportData
var crimeDataState
var crimeDataCounty
var d3Us
var dcUs
var testData

var year_ndx

var state_abbr_dim
var year_dim
var crime_solved_dim
var victim_sex_dim
var victim_age_dim
var victim_race_dim
var prepetrator_sex_dim
var prepetrator_age_dim
var prepetrator_race_dim

var timeChart
var usChart
//var victimRaceChart
var weaponUsedChart
var murderCountND
var solvedCasesND
var victimRacePieChart

var countyName = {};
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

var stateName = {};
var crimeByState = {};
var murderByState = {};
var rapeByState = {};
var robberyByState = {};
var assaultByState = {};
var burglaryByState = {};
var larencyByState = {};
var theftByState = {};
var arsonByState = {};
var populationByState = {};

var minCrimeCounty = 10000000000;
var minCrimeState = 10000000000;
var maxCrimeCounty = 0;
var maxCrimeState = 0;

var fontFamily = 'verdana';
var colorCounty;
var colorState;

var countySelected = null;
var stateSelected = null;
var selectedCountySVG
var selectedStateSVG

queue()
    .defer(d3.json, "/get_squareloadings")
    .defer(d3.json, "/get_eigen_values")
    .defer(d3.json, "/pca_analysis")
    .defer(d3.json, "/pca_analysis")
    .defer(d3.json, "/crime_db/crime_report")
    .defer(d3.json, "static/geojson/us-states.json")
    .defer(d3.json, "/crime_db/crime_data_state")
    .defer(d3.json, "/crime_db/crime_data_county")
    .defer(d3.json, "/us_states_json")
    .defer(d3.json, "/crime_db/crime_analysis")
    .await(initData);

function initData(error, squareLoadingsJson, eigenValuesJson, pcaDataJson, mdsDataJson,
                    crimeReportJson, dcUsJson, crimeDataStateJson, crimeDataCountyJson, d3UsJson, testJson) {
//    console.log("Tarun", "Inside initData")

    if (error) throw error;
//    console.log("Tarun", "After error")

    squareLoadings = squareLoadingsJson
    eigenValues = eigenValuesJson
    pcaData = pcaDataJson
    mdsData = pcaDataJson

	crimeReportData = crimeReportJson
	crimeDataState = crimeDataStateJson
	crimeDataCounty = crimeDataCountyJson
	d3Us = d3UsJson
	dcUs = dcUsJson
	testData = testJson

//    console.log("Tarun Data", crimeDataCounty)

    crimeDataCounty.forEach(function(d) {
        countyName[d.id] = d["County Name"]
        murderByCounty[d.id] = d["Murders"]
        rapeByCounty[d.id] = d["Rapes"]
        robberyByCounty[d.id] = d["Robberies"]
        assaultByCounty[d.id] = d["Assaults"]
        burglaryByCounty[d.id] = d["Burglaries"]
        larencyByCounty[d.id] = d["Larencies"]
        theftByCounty[d.id] = d["Thefts"]
        arsonByCounty[d.id] = d["Arsons"]
        populationByCounty[d.id] = d["Population"]
        crimeByCounty[d.id] = d["Murders"] + d["Rapes"] + d["Robberies"] + d["Assaults"] +
                                d["Burglaries"] + d["Larencies"] + d["Thefts"] + d["Arsons"]

//        console.log("crimeByCounty[d.id] : ", crimeByCounty[d.id]);

        if (crimeByCounty[d.id] < minCrimeCounty) {
            minCrimeCounty = crimeByCounty[d.id]
        }

        if (crimeByCounty[d.id] > maxCrimeCounty) {
            maxCrimeCounty = crimeByCounty[d.id]
        }
    });

    crimeDataState.forEach(function(d) {
        stateName[d.id] = d["State"]
        murderByState[d.id] = d["Murders"]
        rapeByState[d.id] = d["Rapes"]
        robberyByState[d.id] = d["Robberies"]
        assaultByState[d.id] = d["Assaults"]
        burglaryByState[d.id] = d["Burglaries"]
        larencyByState[d.id] = d["Larencies"]
        theftByState[d.id] = d["Thefts"]
        arsonByState[d.id] = d["Arsons"]
        populationByState[d.id] = d["Population"]
        crimeByState[d.id] = d["Murders"] + d["Rapes"] + d["Robberies"] + d["Assaults"] +
                                d["Burglaries"] + d["Larencies"] + d["Thefts"] + d["Arsons"]

//        console.log("crimeByState[d.id] : ", crimeByState[d.id]);
//        console.log("stateName[d.id] : ", stateName[d.id]);
        if (crimeByState[d.id] < minCrimeState) {
            minCrimeState = crimeByState[d.id]
        }

        if (crimeByState[d.id] > maxCrimeState) {
            maxCrimeState = crimeByState[d.id]
        }
    });

//    console.log("Max crime county", maxCrimeCounty);
//    console.log("Min crime county", minCrimeCounty);
//    console.log("Max crime state", maxCrimeState);
//    console.log("Min crime state", minCrimeState);

//    populate_dashboard();
//    populate_dimension();
//    populate_intrinsic();
//    populate_pca();
//    populate_mds();
    populate_slider_county_map();
    populate_slider_state_map();
//    populate_parallel2();
//    populate_stack();
//    populate_bubble();
    console.log("Tarun", "Initiating default click")
//    console.log("Tarun", mdsData)
//    document.getElementById("btn_dashboard").click();
//    document.getElementById("btn_dimensions").click();
//    document.getElementById("btn_pcamds").click();
    document.getElementById("btn_mapview_slider").click();
//    document.getElementById("btn_parallel").click();
//    document.getElementById("btn_stack").click();
//    document.getElementById("btn_bubble").click();
}

function populate_slider_county_map() {

    console.log("Tarun", "Inside populate_silder_county_map")

    var width = 960;
    var height = 600;

//    console.log("Max crime county", maxCrimeCounty);
//    console.log("Min crime county", minCrimeCounty);

    var diffCounty = maxCrimeCounty - minCrimeCounty

    colorCounty = d3.scale.linear()
        .domain([diffCounty/100000, diffCounty/10000, diffCounty/1000, diffCounty/100, diffCounty/10, diffCounty])
        .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);
//        .range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]);
//        .range(["red", "white", "blue"]);

    var path = d3.geo.path();
    var svg = d3.select("#map_slide_county")

//    console.log("Tarun", "Appending paths in Map");

    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(d3Us, d3Us.objects.counties).features)
        .enter().append("path")
        .style("fill", function(d) { return colorCounty(crimeByCounty[d.id]); })
        .attr("d", path)
        .on("click", countyClick)
        .append("title")
        .text(function(d) { return countyName[d.id] + "\n" +
                                   murderByCounty[d.id] + " Murders\n" +
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
        .datum(topojson.mesh(d3Us, d3Us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "county-borders")
        .attr("d", path);

    console.log("Tarun", "Hi there");

//    Code for slider starts here

    d3.select('#slider1').call(d3.slider().value(50));
    d3.select('#slider2').call(d3.slider().value( [ 10, 25 ] ));

/*
    d3.select('#slider3').call(d3.slider().axis(true).value( [ 10, 25 ] ).on("slide", function(evt, value) {
//        d3.select('#slider3textmin').text(value[ 0 ]);
//        d3.select('#slider3textmax').text(value[ 1 ]);
    }));

    d3.select('#slider4').call(d3.slider().on("slide", function(evt, value) {
//        d3.select('#slider4text').text(value);
    }));

    d3.select('#slider5').call(d3.slider().axis(true));

    var slideraxis = d3.svg.axis().orient("top").ticks(4);
    d3.select('#slider6').call(d3.slider().axis(slideraxis));

    d3.select('#slider7').call(d3.slider().axis(true).min(2000).max(2100).step(5));*/

}


function countyClick(d) {
//    console.log("Tarun", "Inside countyClick");

    var selectedCountyId = d.id;
//    console.log("Tarun", selectedCountyId);

    if(countySelected==null) {
        d3.select(this)
            .style("fill", 'red');
        countySelected = selectedCountyId;
        selectedCountySVG = this;
        makePieChart(countySelected, 1);
    } else if(countySelected == selectedCountyId) {
        d3.select(selectedCountySVG).style("fill", colorCounty(crimeByCounty[countySelected]));
        countySelected = null;
        selectedCountySVG = null;
        document.getElementById("pie_chart").style.display = "none";
    } else {
        d3.select(selectedCountySVG).style("fill", colorCounty(crimeByCounty[countySelected]));
        d3.select(this)
            .style("fill", 'red');
        countySelected = selectedCountyId;
        selectedCountySVG = this;
        makePieChart(countySelected, 1);
    }
}

function makePieChart(selected, mapType) {

    var svg = d3.select("#pie_chart");
    var width = 300;
    var height = 300;
    var radius = 150;

    var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    var color = d3.scale.category10();

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.Count; });

    var path = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.svg.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var data = []
//    var type = {"Murder", "Rapes", "Robberies", "Assaults", "Bulglaries", "Larencies", "Thefts", "Arsons"}

    var item = {}

    if (mapType == 1) {
        item ["crimeType"] = "Murder";
        item ["Count"] = murderByCounty[selected];
        data.push(item)

        item ["crimeType"] = "Rapes";
        item ["Count"] = rapeByCounty[selected];
        data.push(item)

        item ["crimeType"] = "Robberies";
        item ["Count"] = robberyByCounty[selected];
        data.push(item)

        item ["crimeType"] = "Assaults";
        item ["Count"] = assaultByCounty[selected];
        data.push(item)

        item ["crimeType"] = "Bulglaries";
        item ["Count"] = burglaryByCounty[selected];
        data.push(item)

        item ["crimeType"] = "Larencies";
        item ["Count"] = larencyByCounty[selected];
        data.push(item)

        item ["crimeType"] = "Thefts";
        item ["Count"] = theftByCounty[selected];
        data.push(item)

        item ["crimeType"] = "Arsons";
        item ["Count"] = arsonByCounty[selected];
        data.push(item)
    } else {

    }

    var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return color(d.data.crimeType); });

    arc.append("text")
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
        .attr("dy", "0.35em")
        .text(function(d) { return d.data.crimeType; });

    document.getElementById("pie_chart").style.display = "block";
}

function populate_slider_state_map() {

    console.log("Tarun", "Inside populate_silder_state_map")

    var width = 960;
    var height = 600;

    console.log("Max crime state", maxCrimeState);
    console.log("Min crime state", minCrimeState);

    var diffState = maxCrimeState - minCrimeState
    console.log("diffState", diffState);

    colorState = d3.scale.linear()
        .domain([diffState/100000, diffState/10000, diffState/1000, diffState/100, diffState/10, diffState])
        .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);
//        .range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]);

    var path = d3.geo.path();
    var svg = d3.select("#map_slide_state")

//    console.log("Tarun", "Appending paths in Map");
    svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(d3Us, d3Us.objects.states).features)
        .enter().append("path")
        .style("fill", function(d) { return colorState(crimeByState[d.id]); })
        .attr("d", path)
        .append("title")
        .text(function(d) { return stateName[d.id] + "\n" +
                                   murderByState[d.id] + " Murders\n" +
                                   rapeByState[d.id] + " Rapes\n" +
                                   robberyByState[d.id] + " Robberies\n" +
                                   assaultByState[d.id] + " Assaults\n" +
                                   burglaryByState[d.id] + " Bulglaries\n" +
                                   larencyByState[d.id] + " Larencies\n" +
                                   theftByState[d.id] + " Thefts\n" +
                                   arsonByState[d.id] + " Arsons\n" +
                                   crimeByState[d.id] + " Total Crimes\n" +
                                   populationByState[d.id] + " Total Population"; });

    svg.append("path")
        .datum(topojson.mesh(d3Us, d3Us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "state-borders")
        .attr("d", path);

    console.log("Tarun", "Hi there");

}

function populate_dashboard() {

    //Create a Crossfilter instance
    year_ndx = crossfilter(crimeReportData);

    console.log("Tarun", "Inside populate_dashboard")
//    console.log("Tarun", "Defining dimensions")

	//Define Dimensions
    state_abbr_dim = year_ndx.dimension(function(d) { return d["State Abbr"]; });
    year_dim = year_ndx.dimension(function(d) { return d["Year"]; });
    crime_solved_dim = year_ndx.dimension(function(d) { return d["Crime Solved"]; });
    victim_sex_dim = year_ndx.dimension(function(d) { return d["Victim Sex"]; });
    victim_age_dim = year_ndx.dimension(function(d) { return d["Victim Age"]; });
    victim_race_dim = year_ndx.dimension(function(d) { return d["Victim Race"]; });
    prepetrator_sex_dim = year_ndx.dimension(function(d) { return d["Perpetrator Sex"]; });
    prepetrator_age_dim = year_ndx.dimension(function(d) { return d["Perpetrator Age"]; });
    prepetrator_race_dim = year_ndx.dimension(function(d) { return d["Perpetrator Race"]; });
    weapon_dim = year_ndx.dimension(function(d) { return d["Weapon"]; });

//    console.log("Tarun", "Calculating Metrices")
//    console.log("Tarun", state_abbr_dim)
//	Calculate metrics
    var all = year_ndx.groupAll();
//    console.log("Tarun", all);
    var numMurdersYear = year_dim.group();
    var totalMurdersByStates = state_abbr_dim.group().reduceSum(function(d) {return 1;});
    var max_murders = totalMurdersByStates.top(1)[0].value;
//	console.log("Tarun", max_murders)

	//Define values (to be used in charts)
	var minYear = year_dim.bottom(1)[0]["Year"];
	var maxYear = year_dim.top(1)[0]["Year"];
//	console.log("Tarun", minYear + ", " + maxYear)

    var casesByVictimRaceType = victim_race_dim.group();
    var casesByWeaponType = weapon_dim.group();

//    console.log("Tarun", "Defining charts")
    //Charts
	timeChart = dc.barChart("#time-chart");
	weaponUsedChart = dc.rowChart("#weapon-used-row-chart");
	usChart = dc.geoChoroplethChart("#us-chart");
	murderCountND = dc.numberDisplay("#murder-count-nd");
	solvedCasesND = dc.numberDisplay("#solved-cases-nd");
	victimRacePieChart = dc.pieChart("#victim-race-pie-chart");

	murderCountND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	solvedCasesND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return Math.ceil(d/3); })
		.group(all)

	timeChart
		.width(600)
		.height(160)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(year_dim)
		.group(numMurdersYear)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minYear, maxYear]))
		.elasticY(true)
		.xAxisLabel("Year")
		.yAxis().ticks(4);

	weaponUsedChart
		.width(300)
		.height(250)
        .dimension(weapon_dim)
        .group(casesByWeaponType)
        .elasticX(true)
        .xAxis().ticks(4);

//    console.log("Tarun", totalVotesByStates)

	usChart.width(1000)
		.height(330)
		.dimension(state_abbr_dim)
		.group(totalMurdersByStates)
		.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
//        .colors(["#E2F2FF", "#C4E4FF", "#0089FF", "#0061B5"])
		.colorDomain([0, max_murders])
		.overlayGeoJson(dcUs["features"], "state", function (d) {
			return d.properties.name;
		})
		.projection(d3.geo.albersUsa()
    				.scale(600)
    				.translate([340, 150]))
		.title(function (p) {
			return "State: " + p["key"]
					+ "\n"
					+ "Total murdders: " + Math.round(p["value"]);
		})

    victimRacePieChart
        .width(250)
        .height(250)
        .slicesCap(5)
        .innerRadius(50)
        .dimension(victim_race_dim)
        .group(casesByVictimRaceType)
        .renderLabel(true);

    dc.renderAll();
//    console.log("Tarun", "Rendering everything")
};


function populate_dimension() {
    console.log("Tarun", "Inside populate_dimension");

    var data = eigenValues;

//    var margin = {top: 20, right: 20, bottom: 30, left: 60};
    var width = 600;
    var height = 400;
//
    var chart_width = 500;
    var chart_height = 450;

    var x = d3.scale.linear().domain([1, data.length + 0.5]).range([0, chart_width]);
    var y = d3.scale.linear().domain([0, d3.max(data) + 0.5]).range([chart_height, 0]);
    var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(9);
    var yAxis = d3.svg.axis().scale(y).orient("left");

    var markerX
    var markerY

    var line = d3.svg.line()
        .x(function(d,i) {
            if (i == 2) {
                markerX = x(i);
                markerY = y(d)
            }
            return x(i);
        })
        .y(function(d) { return y(d); })

    // Add an SVG element with the desired dimensions and margin.
    var svg = d3.select("#scree").append("svg")

    // create yAxis
    svg.append("g")
          .attr("class", "x_axis")
          .attr("transform", "translate(105," + chart_height + ")")
          .call(xAxis);

    // Add the y-axis to the left
    svg.append("g")
          .attr("class", "y_axis")
          .attr("transform", "translate(100,0)")
          .call(yAxis);

    svg.append("text")
        .attr("class", "axis_label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ 50 +","+(height/2)+")rotate(-90)")
        .text("Eigen Values");

    svg.append("text")
        .attr("class", "axis_label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ ((chart_width/2 + 100)) +","+ (chart_height + 50) +")")
        .text("K");

    svg.append("text")
        .attr("class", "chart_name")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(350,540)")
        .text("Scree Plot for Crime Data");

    svg.append("path")
        .attr("class", "screepath")
        .attr("d", line(data))
        .attr("transform", "translate(165,0)");

    svg.append("circle")
              .attr("cx", markerX)
              .attr("cy", markerY)
              .attr("r", 6)
              .attr("transform", "translate(165,0)")
              .style("fill", "red")
              .style("stroke", "red")

    var th_line = svg.append("line")
        .attr("x1", 100)
        .attr("y1", 356)
        .attr("x2", 600)
        .attr("y2", 356)
        .attr("stroke-width", 2)
        .attr("stroke", "green")
}

function populate_intrinsic() {
    console.log("Tarun", "Inside populate_intrinsic");

    loadingVector = squareLoadings;

    var feature_names = Object.keys(loadingVector);
//    console.log("Tarun", feature_names);

    var feature_loadings = []

    for (var i=0; i<feature_names.length; i++) {
        feature_loadings[i] = loadingVector[feature_names[i]];
    }

//    console.log("Tarun", feature_loadings);
    var width = 600;
    var bar_height = 40;
    var padding = 6;
    var left_width = 80;
    var height = (bar_height + padding) * feature_names.length;

    svg = d3.select("#dim_bar")
      .style("transform", "translate(20px, 0px)");

    var x = d3.scale.linear()
       .domain([0, d3.max(feature_loadings)])
       .range([0, width - 150]);

    var y = d3.scale.ordinal()
        .domain(feature_loadings)
        .rangeBands([0, (bar_height + 2 * padding) * feature_loadings.length]);

    var y2 = d3.scale.ordinal()
        .domain(feature_names)
        .rangeBands([0, (bar_height + 2 * padding) * feature_names.length]);

    var line = svg.selectAll("line")
       .data(x.ticks(10))
       .enter().append("line")
       .attr("class", "barline")
       .attr("x1", function(d) { return x(d) + left_width; })
       .attr("x2", function(d) { return x(d) + left_width; })
       .attr("y1", 0)
       .attr("y2", (bar_height + padding * 2) * feature_names.length);

    var rule = svg.selectAll(".rule")
       .data(x.ticks(10))
       .enter().append("text")
       .attr("class", "barrule")
       .attr("x", function(d) { return x(d) + left_width; })
       .attr("y", 0)
       .attr("dy", -6)
       .attr("text-anchor", "middle")
       .attr("font-size", 10)
       .text(String);

    var rect = svg.selectAll("rect")
       .data(feature_loadings)
       .enter().append("rect")
       .attr("x", left_width)
       .attr("y", function(d) { return y(d) + padding; })
       .attr("width", x)
       .attr("height", bar_height)
//       .duration(1000).delay(300).ease('elastic');

    var loadings = svg.selectAll("loadings")
       .data(feature_loadings)
       .enter().append("text")
       .attr("x", function(d) { return x(d) + left_width; })
       .attr("y", function(d){ return y(d) + y.rangeBand()/2; })
       .attr("dx", 105)
       .attr("dy", ".36em")
       .attr("text-anchor", "end")
       .attr('class', 'loadings')
       .text(String);

    var names = svg.selectAll("names")
       .data(feature_names)
       .enter().append("text")
       .attr("x", 0)
       .attr("y", function(d){ return y2(d) + y.rangeBand()/2; } )
       .attr("dy", ".36em")
       .attr("text-anchor", "start")
       .attr('class', 'names')
       .text(String);

    svg.append("text")
        .attr("class", "chart_name")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(350,540)")
        .text("Square loading of all the features");

}


function populate_pca() {
    console.log("Tarun", "Inside populate_pca");

    var obj_array = [];
    var min = 0, max = 0;

    var feature_names = Object.keys(pcaData);

    for(var i=0; i < Object.keys(pcaData[0]).length; ++i){
        obj = {}
        obj.x = pcaData[0][i];
        obj.y = pcaData[1][i];

        obj.clusterid = pcaData['clusterid'][i]
        obj.col1 = pcaData[feature_names[2]][i]
        obj.col2 = pcaData[feature_names[3]][i]
        obj_array.push(obj);
    }

    pcaData = obj_array;

    var width = 650;
    var height = 700;

    var chart_width = 600;
    var chart_height = 450;

    var xValue = function(d) { return d.x;};
    var xScale = d3.scale.linear().range([0, chart_width - 30]);
    var xMap = function(d) { return xScale(xValue(d)); };
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    var yValue = function(d) { return d.y;};
    var yScale = d3.scale.linear().range([chart_height, 0]);
    var yMap = function(d) { return yScale(yValue(d));};
    var yAxis = d3.svg.axis().scale(yScale).orient("left");

    var cluster_color = function(d) { return d.clusterid;}
    var color = d3.scale.category10();

    var svg = d3.select("#pca_plot");

    var tooltip = d3.select("body").append('div').style('position','absolute');

    xScale.domain([d3.min(pcaData, xValue)-1, d3.max(pcaData, xValue)+1]);
    yScale.domain([d3.min(pcaData, yValue)-0.2, d3.max(pcaData, yValue)+0.2]);

    xAxisLine = svg.append("g")
          .attr("transform", "translate(60," + (chart_height) + ")")
          .attr("class", "x_axis")
          .call(xAxis)

    yAxisLine = svg.append("g")
          .attr("transform", "translate(60,0)")
          .attr("class", "y_axis")
          .call(yAxis)

    svg.append("text")
            .attr("class", "axis_label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate("+ 10 +","+(chart_height/2)+")rotate(-90)")
            .text("Component 2");

    svg.append("text")
        .attr("class", "axis_label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (height/2) +","+ (chart_height + 40)+")")
        .text("Component 1");

    svg.append("text")
        .attr("class", "chart_name")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (height/2) +","+ 535 +")")
        .text("PCA plot");

    svg.selectAll(".dot")
          .data(pcaData)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("cx", xMap)
          .attr("r", 3.5)
          .attr("cy", yMap)
          .style("fill", function(d) { return color(cluster_color(d));})
          .on("mouseover", function(d) {
              tooltip.transition()
                .style('opacity', .9)
                .style('font-family', fontFamily)
                .style('color','black')
                .style('font-size', '12px')
              tooltip.html(feature_names[2] + ":" + d.col1 + ", " + feature_names[3] + ":" + d.col2)
                .style("top", (d3.event.pageY - 28) + "px")
                .style("left", (d3.event.pageX + 5) + "px");
          })
          .on("mouseout", function(d) {
              tooltip.transition()
                .duration(500)
                .style("opacity", 0);
              tooltip.html('');
          });
}

function populate_mds() {
    console.log("Tarun", "Inside populate_mds");

    var obj_array = [];
    var min = 0, max = 0;

    var feature_names = Object.keys(mdsData);

    for(var i=0; i < Object.keys(mdsData[0]).length; ++i){
        obj = {}
        obj.x = mdsData[0][i];
        obj.y = mdsData[1][i];

        obj.clusterid = mdsData['clusterid'][i]
        obj.col1 = mdsData[feature_names[2]][i]
        obj.col2 = mdsData[feature_names[3]][i]
        obj_array.push(obj);
    }

    mdsData = obj_array;

    var width = 650;
    var height = 700;

    var chart_width = 600;
    var chart_height = 450;

    var xValue = function(d) { return d.x;};
    var xScale = d3.scale.linear().range([0, chart_width - 30]);
    var xMap = function(d) { return xScale(xValue(d)); };
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    var yValue = function(d) { return d.y;};
    var yScale = d3.scale.linear().range([chart_height, 0]);
    var yMap = function(d) { return yScale(yValue(d));};
    var yAxis = d3.svg.axis().scale(yScale).orient("left");

    var cluster_color = function(d) { return d.clusterid;}
    var color = d3.scale.category10();

    var svg = d3.select("#mds_plot");

    var tooltip = d3.select("body").append('div').style('position','absolute');

    xScale.domain([d3.min(mdsData, xValue)-1, d3.max(mdsData, xValue)+1]);
    yScale.domain([d3.min(mdsData, yValue)-0.2, d3.max(mdsData, yValue)+0.2]);

    xAxisLine = svg.append("g")
          .attr("transform", "translate(60," + (chart_height) + ")")
          .attr("class", "x_axis")
          .call(xAxis)

    yAxisLine = svg.append("g")
          .attr("transform", "translate(60,0)")
          .attr("class", "y_axis")
          .call(yAxis)

    svg.append("text")
            .attr("class", "axis_label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate("+ 10 +","+(chart_height/2)+")rotate(-90)")
            .text("Component 2");

    svg.append("text")
        .attr("class", "axis_label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (height/2) +","+ (chart_height + 40)+")")
        .text("Component 1");

    svg.append("text")
        .attr("class", "chart_name")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (height/2) +","+ 535 +")")
        .text("MDS plot");

    svg.selectAll(".dot")
          .data(mdsData)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("cx", xMap)
          .attr("r", 3.5)
          .attr("cy", yMap)
          .style("fill", function(d) { return color(cluster_color(d));})
          .on("mouseover", function(d) {
              tooltip.transition()
                .style('opacity', .9)
                .style('font-family', fontFamily)
                .style('color','black')
                .style('font-size', '12px')
              tooltip.html(feature_names[2] + ":" + d.col1 + ", " + feature_names[3] + ":" + d.col2)
                .style("top", (d3.event.pageY - 28) + "px")
                .style("left", (d3.event.pageX + 5) + "px");
          })
          .on("mouseout", function(d) {
              tooltip.transition()
                .duration(500)
                .style("opacity", 0);
              tooltip.html('');
          });
}

function populate_parallel1() {
    var margin = {top: 30, right: 10, bottom: 10, left: 10};
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangePoints([0, width], 1);
    var y = {};

    var line = d3.svg.line();
    var axis = d3.svg.axis().orient("left")
    var background;
    var foreground;

    var svg = d3.select("#parallel")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Returns the path for a given data point.
    function path(d) {
      return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(crimeDataState[0]).filter(function(d) {
        return (d=="State" || d == "Murders" || d == "Rapes" || d == "Robberies" || d == "Assaults"
        || d == "Burglaries" || d == "Larencies" || d == "Thefts" || d == "Arsons") && (y[d] = d3.scale.linear()
            .domain(d === "State"
                    ? crimeDataState.map(function(p) { return p[d.name]; })
                    : d3.extent(crimeDataState, function(p) { return +p[d]; }))
            .range([height, 0]));
     }));

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(crimeDataState)
        .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(crimeDataState)
        .enter().append("path")
        .attr("d", path);

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

    // Add an axis and title.
    g.append("g")
        .attr("class", "vaxis")
        .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);


    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); })
        var extents = actives.map(function(p) { return y[p].brush.extent(); });

        foreground.style("display", function(d) {
            return actives.every(function(p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });
    }
}


function populate_parallel() {
    var margin = {top: 30, right: 40, bottom: 20, left: 200};
    var width = 1260 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var dimensions = [
      {
        name: "State",
        scale: d3.scale.ordinal().rangePoints([0, height]),
        type: String
      },
      {
        name: "Murders",
        scale: d3.scale.linear().range([0, height]),
        type: Number
      },
      {
        name: "Rapes",
        scale: d3.scale.linear().range([height, 0]),
        type: Number
      },
      {
        name: "Robberies",
        scale: d3.scale.linear().range([height, 0]),
        type: Number
      },
      {
        name: "Assaults",
        scale: d3.scale.linear().range([height, 0]),
        type: Number
      },
      {
        name: "Burglaries",
        scale: d3.scale.linear().range([height, 0]),
        type: Number
      },
      {
        name: "Larencies",
        scale: d3.scale.linear().range([height, 0]),
        type: Number
      },
      {
        name: "Thefts",
        scale: d3.scale.linear().range([height, 0]),
        type: Number
      },
      {
        name: "Arsons",
        scale: d3.scale.linear().range([height, 0]),
        type: Number
      }
    ];

    var x = d3.scale.ordinal()
        .domain(dimensions.map(function(d) { return d.name; }))
        .rangePoints([0, width]);

    var y = {};

    var line = d3.svg.line()
        .defined(function(d) { return !isNaN(d[1]); });

    var yAxis = d3.svg.axis()
        .orient("left");

    var svg = d3.select("#parallel")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dimension = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; });

    dimensions.forEach(function(dimension) {
        y[dimension] = dimension.scale.domain(dimension.type === Number
            ? d3.extent(crimeDataState, function(d) { return +d[dimension.name]; })
            : crimeDataState.map(function(d) { return d[dimension.name]; }));
      });

    var background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(crimeDataState)
        .enter().append("path")
        .attr("d", draw);

    var foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(crimeDataState)
        .enter().append("path")
        .attr("d", draw);

    function draw(d) {
      return line(dimensions.map(function(dimension) {
        return [x(dimension.name), dimension.scale(d[dimension.name])];
      }));
    }

    dimension.append("g")
        .attr("class", "vaxis")
        .each(function(d) { d3.select(this).call(yAxis.scale(d.scale)); })
        .append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d.name; });

    // Rebind the axis data to simplify mouseover.
    svg.select(".vaxis").selectAll("text:not(.title)")
        .attr("class", "label")
        .data(crimeDataState, function(d) { return d.name || d; });

    var projection = svg.selectAll(".vaxis text,.background path,.foreground path")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    function mouseover(d) {
        svg.classed("active", true);
        projection.classed("inactive", function(p) { return p !== d; });
        projection.filter(function(p) { return p === d; }).each(moveToFront);
    }

    function mouseout(d) {
        svg.classed("active", false);
        projection.classed("inactive", false);
    }

    function moveToFront() {
        this.parentNode.appendChild(this);
    }
}


function populate_parallel2() {
    var margin = {top: 30, right: 40, bottom: 20, left: 200};
    var width = 1260 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var dimensions = [
      {
        name: "State",
        scale: d3.scale.ordinal().rangePoints([0, height]),
        type: String
      },
      {
        name: "Murders_Rate",
        scale: d3.scale.linear().range([0, height]),
        type: Number
      },
      {
        name: "Rapes_Rate",
        scale: d3.scale.linear().range([height, 0]),
        type: Number
      },
      {
        name: "Robberies_Rate",
        scale: d3.scale.linear().range([height, 0]),
        type: Number
      },
      {
        name: "Assaults_Rate",
        scale: d3.scale.linear().range([height, 0]),
        type: Number
      },
      {
        name: "Burglaries_Rate",
        scale: d3.scale.linear().range([height, 0]),
        type: Number
      },
      {
        name: "Larencies_Rate",
        scale: d3.scale.linear().range([height, 0]),
        type: Number
      },
      {
        name: "Thefts_Rate",
        scale: d3.scale.linear().range([height, 0]),
        type: Number
      },
      {
        name: "Arsons_Rate",
        scale: d3.scale.linear().range([height, 0]),
        type: Number
      }
    ];

    var dragging = {};
    var foreground;
    var background;
    var y = {};

    var x = d3.scale.ordinal()
        .domain(dimensions.map(function(d) { return d.name; }))
        .rangePoints([0, width]);

    var line = d3.svg.line()
        .defined(function(d) { return !isNaN(d[1]); });

    var yAxis = d3.svg.axis()
        .orient("left");

    var svg = d3.select("#parallel")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dimension = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; });

    //trying to set y
    d3.keys(crimeDataState[0]).filter(function(d) {
        y[d]=d3.scale.linear().domain(d3.extent(crimeDataState, function(p) { return +p[d]; })).range([height, 0]);
        return d != "State" && y[d];
    });

    dimensions.forEach(function(dimension) {
        dimension.scale.domain(dimension.type === Number
            ? d3.extent(crimeDataState, function(d) { return +d[dimension.name]; })
            : crimeDataState.map(function(d) { return d[dimension.name]; }));
      });

    var background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(crimeDataState)
        .enter().append("path")
        .attr("d", draw);

    var foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(crimeDataState)
        .enter().append("path")
        .attr("d", draw);

    function draw(d) {
      return line(dimensions.map(function(dimension) {
        return [x(dimension.name), dimension.scale(d[dimension.name])];
      }));
    }

    dimension.append("g")
        .attr("class", "vaxis")
        .each(function(d) { d3.select(this).call(yAxis.scale(d.scale)); })
        .append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d.name; });

    // Rebind the axis data to simplify mouseover.
    svg.select(".vaxis").selectAll("text:not(.title)")
        .attr("class", "label")
        .data(crimeDataState, function(d) { return d.name || d; });
/*
    var projection = svg.selectAll(".vaxis text,.background path,.foreground path")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    function mouseover(d) {
        svg.classed("active", true);
        projection.classed("inactive", function(p) { return p !== d; });
        projection.filter(function(p) { return p === d; }).each(moveToFront);
    }

    function mouseout(d) {
        svg.classed("active", false);
        projection.classed("inactive", false);
    }

    function moveToFront() {
        this.parentNode.appendChild(this);
    }

*/

    //for brushing
    // Add a group element for each dimension.
    var g = dimension.call(d3.behavior.drag()
        .origin(function(d) { console.log({x: x(d.name)});return {x: x(d.name)}; })
        .on("dragstart", function(d) {
            dragging[d.name] = x(d.name);
            background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
            dragging[d.name] = Math.min(width, Math.max(0, d3.event.x));
            foreground.attr("d", path); //ch path to draw
            dimensions.sort(function(a, b) { return position(a.name) - position(b.name); });
            x.domain(dimensions);
            g.attr("transform", function(d) { return "translate(" + position(d.name) + ")"; })
        })
        .on("dragend", function(d) {
            delete dragging[d.name];

            transition(d3.select(this)).attr("transform", "translate(" + x(d.name) + ")");
            transition(foreground).attr("d", path);//ch

            background
                .attr("d", path)//ch
                .transition()
                .delay(500)
                .duration(0)
                .attr("visibility", null);
        }
    ));

    // Add and store a brush for each axis.
    g.append("g")
    .attr("class", "brush")
    .each(function(d) {
        d3.select(this).call(y[d.name].brush = d3.svg.brush().y(y[d.name]).on("brushstart", brushstart).on("brush", brush));
    })
    .selectAll("rect")
    .attr("x", -8)
    .attr("width", 16);

    // setting up brushing
    // Add a group element for each dimension.
    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
      return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
      return line(dimensions.map(function(p) {
        return [position(p.name), y[p.name](d[p.name])];
      }));
    }

    function brushstart() {
      d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function(p) { return !y[p.name].brush.empty(); }),
        extents = actives.map(function(p) { return y[p.name].brush.extent(); });
        foreground.style("display", function(d) {
        return actives.every(function(p, i) {
        return extents[i][0] <= d[p.name] && d[p.name] <= extents[i][1];
        }) ? null : "none";
        });
    }

    //end of brushing part
}


function populate_stack() {

}

function populate_bubble() {

}

function openTabClick(evt, container, index) {

//    console.log("Tarun", index);
//     Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(container).style.display = "block";
    evt.currentTarget.className += " active";

    switch(index) {
        case 1:
//            console.log("Tarun", "Inside case 1");
            break;
        case 2:
//            console.log("Tarun", "Inside case 2");
            break;
        case 3:
//            console.log("Tarun", "Inside case 3");
            break;
    }
}

function contains(array, obj) {
    var i = array.length;
    while (i--) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}