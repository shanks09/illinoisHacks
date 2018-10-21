var width = 1500,
    height = 637;
var data_wildlife = [],
    data_water_sanitation = [],
    data_undernourishment = [],
    data_literacy = [],
    country = {},
	combined = {},
	aggr = [];
//Map projection
var projection = d3.geoMercator()
    .scale(148.73458983383966)
    .center([0,43.790094023341574]) //projection center
    .translate([width/2,height/2]) //translate to center the map in view
var color = d3.scaleLinear()
    .range(["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"])
    .domain([0,1,2,3,4]);

//Generate paths based on projection
var path = d3.geoPath()
    .projection(projection);

//Create an SVG
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//Group for the map features
var features = svg.append("g")
    .attr("class","features");
var legend, legendText;
//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale

//Create a tooltip, hidden at the start
var tooltip = d3.select("body").append("div").attr("class","tooltip");
var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom",zoomed);
svg.call(zoom);
//Update map on zoom/pan
function zoomed() {
    // features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
    //     .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
    features.attr("transform", d3.event.transform);
}
d3.json("data/res/countries.topojson",function(error,geodata) {
    if (error) return console.log(error); //unknown error, check the console
    d3.csv("data/res/WATER_SANITATION.csv", function(data1) {
        d3.csv("data/res/FOOD_DEFICIT.csv", function(data2) {
            d3.csv("data/res/LITERACY_RATE.csv", function(data3) {

                for(var i=0;i<geodata.objects.subunits.geometries.length;i++){
                    country[geodata.objects.subunits.geometries[i].properties.name] = geodata.objects.subunits.geometries[i].id;
					combined[geodata.objects.subunits.geometries[i].properties.name] = {country:geodata.objects.subunits.geometries[i].properties.name, water: 0, sanitation: 0, food: 0, illiteracy:0};
                }
                console.log(Object.keys(country).length);
				console.log(combined);
                for(var i=0;i<data1.length;i++) {
                    var temp = {iso: data1[i].ISO, country: data1[i].Country, water: 100-data1[i].Water, sanitation: 100-data1[i].Sanitation};
					if(temp.country && temp.country in combined) {
						combined[temp.country].water = temp.water;
						combined[temp.country].sanitation = temp.sanitation;
					}
					data_water_sanitation.push(temp)
                }
                console.log(data_water_sanitation);

                for(var i=0;i<data2.length;i++) {
                    var temp = {iso: data2[i].ISO, country: data2[i].Country, percent: data2[i].Percent};
					if(temp.country && temp.country in combined) {
						combined[temp.country].food = temp.percent;
					}
                    data_undernourishment.push(temp)
                }
                console.log(data_undernourishment);

                for(var i=0;i<data3.length;i++) {
                    var temp = {iso: data3[i].ISO, country: data3[i].Country, literacy: 100-data3[i].Literacy};
					if(temp.country && temp.country in combined) {
						combined[temp.country].illiteracy = temp.literacy;
					}
                    data_literacy.push(temp)
                }
                console.log(data_literacy);
				for (var key in combined) {
					if (combined.hasOwnProperty(key)) {
						aggr.push( combined[key]);
					}
				}
				console.log(aggr);
                createMyMap(1);
                // d3.json("data/res/countries.topojson",function(error,geodata) {
                //     if (error) return console.log(error); //unknown error, check the console
                //
                //     //Create a path for each map feature in the data
                //     features.selectAll("path")
                //         .data(topojson.feature(geodata,geodata.objects.subunits).features) //generate features from TopoJSON
                //         .enter()
                //         .append("path")
                //         .attr("d",path)
                //         .on("mouseover",showTooltip)
                //         .on("mousemove",moveTooltip)
                //         .on("mouseout",hideTooltip)
                //         .on("click",clicked);
                //
                //     var view = geodata.objects.subunits.geometries;
                //     for(var i=0;i<view.length;i++){
                //         country[view[i].properties.name] = view[i].id;
                //     }
                //     console.log(country)
                //
                // });

                // Add optional onClick events for features here
                // d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
                function clicked(d,i) {

                }

                $(document).ready(function(){
                    $('#rBtn1, #rBtn2, #rBtn3, #rBtn4').on('click', function() {

                        if(this.id == "rBtn1") {
                            createMyMap(1);
                        }
                        else if(this.id == "rBtn2") {
                            createMyMap(2);
                        }
                        else if(this.id == "rBtn3") {
                            createMyMap(3);
                        }
                        else if(this.id == "rBtn4") {
                            createMyMap(4);
                        }

                    });});

                function createMyMap(n){
                    features.remove()
                    d3.select("#legendMap").remove()
                    features = svg.append("g")
                        .attr("class","features");
                    //Create a path for each map feature in the data
                    if(n == 1) {
                        color = d3.scaleLinear()
                            .range(["#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603"])
                            .domain([0,1,2,3,4]);
                        legendText = ["0-10% Population Malnurished", "11-20% Population Malnurished", "21-30% Population Malnurished", "31-40% Population Malnurished", "41% & above Population Malnurished"]
                    }
                    else if(n == 2) {
                        color = d3.scaleLinear()
                            .range(["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"])
                            .domain([0,1,2,3,4]);
                        legendText = ["0-20% Population Deprived of Basic Sanitation", "21-40% Population Deprived of Basic Sanitation", "41-60% Population Deprived of Basic Sanitation", "61-80% Population Deprived of Basic Sanitation", "81% & above Population Deprived of Basic Sanitation"]
                    }
                    else if(n == 3) {
                        color = d3.scaleLinear()
                            .range(["#fff5cc", "#ffe066", "#ffcc00", "#b38f00", "#665200"])
                            .domain([0,1,2,3,4]);
                        legendText = ["0-10% Population Deprived of Water", "11-20% Population Deprived of Water", "21-30% Population Deprived of Water", "31-50% Population Deprived of Water", "51% & above Population Deprived of Water"]
                    }
                    else if(n == 4) {
                        color = d3.scaleLinear()
                            .range(["#ebebfa", "#c2c2f0", "#8585e0", "#4747d1", "#1f1f7a"])
                            .domain([0,1,2,3,4]);
                        legendText = ["0-10% Illiterate Demographic", "11-20% Illiterate Demographic", "21-30% Illiterate Demographic", "31-60% Illiterate Demographic", "61% & above Illiterate Demographic"]
                    }
                    features.selectAll("path")
                        .data(topojson.feature(geodata,geodata.objects.subunits).features) //generate features from TopoJSON
                        .enter()
                        .append("path")
                        .attr("d",path)
                        .on("mouseover",showTooltip)
                        .on("mousemove",moveTooltip)
                        .on("mouseout",hideTooltip)
                        .on("click",clicked)
                        .style("fill", function (d) {

                            // Get data value
                            // var value = d.properties.killCount;
                            var value;
							var value1;
							var value2;
							var value3;
                            if(n == 1) {
                                for (var i = 0; i < data_undernourishment.length; i++) {
                                    if (d.properties.name == data_undernourishment[i].country) {
                                        value1 = data_undernourishment[i].percent;
                                        break;
                                    }
                                }
                            }
                            else if(n == 2) {
                                for (var i = 0; i < data_water_sanitation.length; i++) {
                                    if (d.properties.name == data_water_sanitation[i].country) {
                                        value = data_water_sanitation[i].sanitation;
                                        break;
                                    }
                                }
                            }
                            else if(n == 3) {
                                for (var i = 0; i < data_water_sanitation.length; i++) {
                                    if (d.properties.name == data_water_sanitation[i].country) {
                                        value2 = data_water_sanitation[i].water;
                                        break;
                                    }
                                }
                            }
                            else if(n == 4) {
                                for (var i = 0; i < data_literacy.length; i++) {
                                    if (d.properties.name == data_literacy[i].country) {
                                        value3 = data_literacy[i].literacy;
                                        break;
                                    }
                                }
                            }
							if (value1) {
                                if (value1 <= 10)
                                    return color(0);
                                else if (value1 <= 20)
                                    return color(1);
                                else if (value1 <= 30)
                                    return color(2);
                                else if (value1 <= 40)
                                    return color(3);
                                else if (value1 <= 100)
                                    return color(4);
                                // var normalized = ((8-0)*((value-stateMin)/(stateMax-stateMin))) + 0;
                            }
							if (value2) {
                                if (value2 <= 10)
                                    return color(0);
                                else if (value2 <= 20)
                                    return color(1);
                                else if (value2 <= 30)
                                    return color(2);
                                else if (value2 <= 50)
                                    return color(3);
                                else if (value2 <= 100)
                                    return color(4);
                                // var normalized = ((8-0)*((value-stateMin)/(stateMax-stateMin))) + 0;

                            }
							if (value3) {
                                if (value3 <= 10)
                                    return color(0);
                                else if (value3 <= 20)
                                    return color(1);
                                else if (value3 <= 30)
                                    return color(2);
                                else if (value3 <= 60)
                                    return color(3);
                                else if (value3 <= 100)
                                    return color(4);
                                // var normalized = ((8-0)*((value-stateMin)/(stateMax-stateMin))) + 0;

                            }
                            if (value) {
                                if (value <= 20)
                                    return color(0);
                                else if (value <= 40)
                                    return color(1);
                                else if (value <= 60)
                                    return color(2);
                                else if (value <= 80)
                                    return color(3);
                                else if (value <= 100)
                                    return color(4);
                                // var normalized = ((8-0)*((value-stateMin)/(stateMax-stateMin))) + 0;

                            } else {
                                return "#d5ded9";
                            }
                        });
                   legend = d3.select("body").append("svg")
                        .attr("id", "legendMap")
                        .attr("class", "legend")
                        .attr("width", 350)
                        .attr("height", 200)
                        .selectAll("g")
                        .data(color.domain())
                        .enter()
                        .append("g")
                        .attr("transform", function (d, i) {
                            return "translate(0," + i * 20 + ")";
                        });

                    legend.append("rect")
                        .attr("width", 18)
                        .attr("height", 18)
                        .style("fill", color);

                    legend.append("text")
                        .data(legendText)
                        .attr("x", 24)
                        .attr("y", 9)
                        .attr("dy", ".35em")
                        .text(function (d) {
                            return d;
                        });
                }


                //Position of the tooltip relative to the cursor
                var tooltipOffset = {x: 5, y: -25};

                //Create a tooltip, hidden at the start
                function showTooltip(d) {
                    moveTooltip();

                    tooltip.style("display","block")
                        .text(d.properties.name);
                }

                //Move the tooltip to track the mouse
                function moveTooltip() {
                    tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
                        .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
                }

                //Create a tooltip, hidden at the start
                function hideTooltip() {
                    tooltip.style("display","none");
                }
                createMyDonut("Afghanistan");
                // d3.select('.secondSVG')
                //     .style('visibility', "visible")

                function createMyDonut(country) {
                    d3.select("#myPie").remove();
                    d3.selectAll("#tooltipDonut").remove();

                    var w, s, f, i;
                    w = parseFloat(combined[country].water);
                    s = parseFloat(combined[country].sanitation)
                    f = parseFloat(combined[country].food)
                    i = parseFloat(combined[country].illiteracy)
                    var mydata = [Math.round((w/(w+s+f+i))*100), Math.round((s/(w+s+f+i))*100), Math.round((f/(w+s+f+i))*100), Math.round((i/(w+s+f+i))*100)]

                    var pw = 450,
                        ph = 450,
                        pr = Math.min(pw, ph) / 2;

                    var clr = d3.scaleOrdinal()
                        .domain([0, 1, 2, 3])
                        .range(["#ffcc00", "#74c476", "#fd8d3c", "#8585e0"]);
                        // .range(["#665200", "#006d2c", "#a63603", "#1f1f7a"]);
                    //var myCol = d3.scaleOrdinal(d3.schemeCategory20c);
                    // var clr = d3.scaleOrdinal()
                    //     .range(["#ef8a62", "#807dba"])
                    var tooltipDonut = d3.select('body')
                        .append('div')
                        .attr('class', 'tooltipDonut')
                        .attr("id", "tooltipDonut");


                    tooltipDonut.append('div')
                        .attr('class', 'label');

                    tooltipDonut.append('div')
                        .attr('class', 'count');

                    tooltipDonut.append('div')
                        .attr('class', 'percent');

                    var svg_pie = d3.select("body")
                        .append("div")
                        .attr("id", "myPie")
                        .append("svg")
                        .attr("class", "secondSVG")
                        .attr('width', pw)
                        .attr('height', ph)
                        .append('g')
                        .attr('transform', 'translate(' + (pw / 2) +
                            ',' + (ph / 2) + ')');

                    var donutWidth = 75;

                    var arc = d3.arc()
                        .innerRadius(pr - donutWidth)
                        .outerRadius(pr);

                    var pie = d3.pie()
                        .value(function(d) { return d; })
                        .sort(null);

                    var legendRectSize = 18;
                    var legendSpacing = 4;
                    var pathDonut = svg_pie.selectAll('path')
                        .data(pie(mydata))
                        .enter()
                        .append('path')
                        .attr('d', arc)
                        .style('fill', function(d, i) {
                            return clr(i);
                        });

                    pathDonut.on('mouseover', function(d,i) {
                        d3.select(this).style('opacity',0.3);
                        tooltipDonut.select('.label').html(function() {
                            if(i==0)
                                return "Water";
                            if(i==1)
                                return "Sanitation";
                            if(i==2)
                                return "Famines";
                            if(i==3)
                                return "Illiteracy";});
                        // tooltipDonut.select('.count').html("Total: " + c);
                        tooltipDonut.select('.percent').html(mydata[i] + '%');
                        tooltipDonut.style("opacity", .9);
                        // .style("left", 140 + "px")
                        // .style("top", 900 + "px")
                    });

                    pathDonut.on('mouseout', function() {
                        tooltipDonut.style("opacity", 0);
                        d3.select(this).style('opacity',1);
                    });

                    var legendDonut = svg_pie.selectAll('.legendDonut')
                        .data(clr.domain())
                        .enter()
                        .append('g')
                        .attr('class', 'legendDonut')
                        .attr('transform', function(d, i) {
                            var h = legendRectSize + legendSpacing;
                            var offset =  h * clr.domain().length / 2;
                            var horz = -2 * legendRectSize;
                            var vert = i * h - offset;
                            return 'translate(' + horz + ',' + vert + ')';
                        });

                    legendDonut.append('rect')
                        .attr('width', legendRectSize)
                        .attr('height', legendRectSize)
                        .style('fill', clr)
                        .style('stroke', clr);
                    legendDonut.append('text')
                        .attr('x', legendRectSize + legendSpacing)
                        .attr('y', legendRectSize - legendSpacing)
                        .text(function(d,i) {
                                if(i==0)
                                    return "Water";
                                if(i==1)
                                    return "Sanitation";
                                if(i==2)
                                    return "Famines";
                                if(i==3)
                                    return "Illiteracy";
                        });

                    d3.select('#myPie').append("div")
                        .attr("class","pieText")
                        .text("A Donut Viz. showing Severity Chart for \""+ country+"\" in all 4 affected areas.")
                }
            });
        });
    });
});

var radioBtn = svg.append("foreignObject")
					.attr("width", 250)
					.attr("height", 150)
					.attr("x", "5%")
					.attr("y", "5%")
					.append("xhtml:body");
					
//radioBtn.append("div").attr("id", "radioBtn_map1")
	//				.append("input").attr("type", "radio").attr("id", "rBtn11").attr("name", "group2").classed("selected");//.attr("id", "rBtn1").attr("name", "group1").attr("type", "radio").;

radioBtn.html("<div id=\"radioBtn_map\">"+
        "<input type='radio' id='rBtn1' name='group1' checked>Malnutrition<br>"+
        "<input type='radio' id='rBtn2' name='group1'>Sanitation<br>"+
        "<input type='radio' id='rBtn3' name='group1'>Water<br>"+
		"<input type='radio' id='rBtn4' name='group1'>Literacy"+
        "</div>");


