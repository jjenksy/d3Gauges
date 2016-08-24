/**
 * Created by jjenkins on 8/23/2016.
 */

/**
 * Created by jjenkins on 8/9/2016.
 */
//defines my require js module
define(['d3'],function (d3) {

    //create an pointless constructor
    var BarGauge = function () {
    };


    /**
     * Create a bargauge object that will be the root element
     * @type {Object}
     */
    BarGauge.prototype = Object.create(null);
    BarGauge.prototype.constructor = BarGauge;


        'use strict';

    /**
     * an object that holds the default params for the gauge
     * @type {{left: number, top: number}}
     */
        var options = {
            left: 20,
            top: 10
        };


    /**
     * get the values an min, max to be return to render
     * @param val value passed and parsed
     * @param min minimum gauge
     * @param max maximum for gauge
     * @returns {{max: *, min: *, data: *[]}}
     */
        function makeModel(val, min , max) {
            var value=val,
                autoScale = false,
                autoScaleStep = 10;


            if (value === undefined || value === null) {
                value = 0;
            }
            else {
                // Just hope we have a value...
                value = parseFloat(value);
            }

            if (autoScale) {
                // Figure out the minimum scale.
                while (value < min) {
                    min -= autoScaleStep;
                }

                // Figure out the maximum scale.
                while (value > max) {
                    max += autoScaleStep;
                }
            }

            return {
                max: max,
                min: min,
                data: [{
                    value: value
                }]
            };
        }

    /**
     * @render renders the actual gauge to the dom
     * @param val value that is passed to makeModel then returned as an objects
     * @param min minimum gauge
     * @param max max gauge
     * @param color color of the moving bar
     */
        function render(val , min , max, color) {
            var width =  800 - options.left * 2,
                height = 50,
                model = makeModel(val, min , max),
                x,
                y,
                gauge,
                bk,
                grid,
                axis,
                bar;



            // linear: progressing from one stage to another in a single series of steps
            //scale for your x value
            x = d3.scale.linear()
            //this is the set of x-values that give rise to real y-values
                .domain([model.min, model.max])// determines the domain of the gauge and make dynamic
                //The difference between the lowest and highest values. In {4, 6, 9, 3, 7} the lowest value is 3, and the highest is 9, so the range is 9 − 3 = 6.
                .range([0, width]);


            y = d3.scale.linear()
                .range([0, height]);


            gauge = d3.select("#barGauge")
                .select(".barGauge-linear-gauge")
                .select("g");


            // Render the background from created class below
            bk = gauge.selectAll(".barGauge-linear-gauge-background")
                .data(model.data);

            //create a background rect and add a class to it
            bk.enter()
                .append("rect")
                .attr("class", "barGauge-linear-gauge-background");

            bk.attr("width", width)
                .attr("height", height);

            // The background has a grid on top. select the class from below
            grid = gauge.selectAll(".barGauge-linear-grid")
                .data(model.data);
            //create a grid and add a class to it
            grid.enter()
                .append("g")
                .attr("class", "barGauge-linear-grid");


            var ticksMinor = d3.svg.axis().scale(x).ticks(20).tickSize(-height);
            grid.attr("transform", "translate(0," + height + ")")
                .call(ticksMinor) // calling the tickMinor
                .selectAll(".barGauge-linear-tick")
                .data(x.ticks(10), function(d) {
                    console.log(d);
                    return d; })
                .exit()
                .classed("barGauge-linear-minor", true);

            // The background has an axis drawn at the bottom of it.
            axis = gauge.selectAll(".barGauge-linear-axis")
                .data(model.data);

            axis.enter()
                .append("g")
                .attr("class", "barGauge-linear-axis");

            var ticksMajor=d3.svg.axis().scale(x).ticks(10);
            axis.attr("transform", "translate(0," + height + ")")
                .call(ticksMajor);

            // The data bar is drawn on top.
            bar = gauge.selectAll(".barGauge-linear-bar")
                .data(model.data);

            bar.enter()
                .append("g")
                .append("rect")
                .attr("class", "barGauge-linear-bar")
                .attr("x", 0)
                .attr("y", 0);

            bar.attr("height", height ) //height of the moving bar
                .transition()
                .attr("fill", color)//color of the moving bar
                .attr("width", function (d) {
                    var w = x(d.value);
                    if (w > width) {
                        w = width;
                    }
                    else if (w < 0) {
                        w = 0;
                    }
                    return w;
                });
        }




    d3.select("#barGauge")
        .append('svg')
        .attr('top', 0)
        .attr('left', 0)
        .attr('width', "100%")
        .attr('height', "100%")
        .attr('class', 'barGauge-linear-gauge')
        .append('g')
        .attr('transform', 'translate(' + options.left + ',' + options.top + ')');

    function updateReadings() {
        // just pump in random data here...
        var input =Math.random() * 100;
        console.log("Readings update "+input);
        render(input,0,100,"steelblue");

            }
    updateReadings();
    setInterval(function() {
        updateReadings();
    }, 5 * 1000);



    // return the PowerOneLine module
    return BarGauge;


});



