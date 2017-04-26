var ndx

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
var victimRaceChart
var weaponUsedChart
var murderCountND
var solvedCasesND
var victimRacePieChart

queue()
    .defer(d3.json, "/crime_db/crime_year")
    .defer(d3.json, "static/geojson/us-states.json")
    .await(makeGraphs);

function makeGraphs(error, crimeYearJson, statesJson) {
//    console.log("Tarun", "Inside makeGraphs")
	//Clean electionJson data

//    console.log("Tarun Data", crimeYearJson)
	//Create a Crossfilter instance
    year_ndx = crossfilter(crimeYearJson);

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

    console.log("Tarun", "Calculating Metrices")
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
	console.log("Tarun", minYear + ", " + maxYear)

    var casesByVictimRaceType = victim_race_dim.group();
    var casesByWeaponType = weapon_dim.group();

//    console.log("Tarun", "Defining charts")
    //Charts
	timeChart = dc.barChart("#time-chart");
//	victimRaceChart = dc.rowChart("#victim-race-row-chart");
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
		.valueAccessor(function(d){return d; })
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

//	victimRaceChart
//        .width(300)
//        .height(250)
//        .dimension(victim_race_dim)
//        .group(casesByVictimRaceType)
//        .elasticX(true)
//        .xAxis().ticks(4);

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
		.overlayGeoJson(statesJson["features"], "state", function (d) {
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

    console.log("Tarun", "Rendering everything")
    dc.renderAll();

};