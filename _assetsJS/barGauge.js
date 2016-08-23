/**
 * Created by jjenkins on 8/23/2016.
 */

/**
 * Created by jjenkins on 8/9/2016.
 */
//defines my require js module
define(['d3','jquery'],function (d3,$) {

    //create an pointless constructor
    var BarGauge = function () {
    };


    BarGauge.prototype = Object.create(null);
    BarGauge.prototype.constructor = BarGauge;



        'use strict';

        var options = {
            left: 20,
            top: 10
        };



        function makeModel(widget) {
            var value,
                min = widget.$min =  widget.$min,
                max = widget.$max = widget.$max,
                autoScale = props.getValue("autoScale"),
                autoScaleStep = props.getValue("autoScaleStep");

            if (value === undefined || value === null) {
                value = 0;
            }
            // If this is a control point then get its out value...
            else if (value.getType().is("control:ControlPoint")) {
                value = value.getOut().getValue();
            }
            // If this is a StatusNumeric then get its value...
            else if (value.getType().is("baja:StatusNumeric")) {
                value = value.getValue();
            }
            else {
                // Just hope we have a value...
                value = parseFloat(value);
            }

            if (!_.isNumber(value)) {
                value = 0;
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
        // function to create the scalable graph
        function render(widget) {
            var width =  800 - options.left * 2,
                height = 50,
                model = makeModel(widget),
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

            gauge = d3.select(widget.jq()[0])
                .select(".example-linear-gauge")
                .select("g");

            // Render the background
            bk = gauge.selectAll(".example-linear-grid-background")
                .data(model.data);

            bk.enter()
                .append("rect")
                .attr("class", "example-linear-grid-background");

            bk.attr("width", width)
                .attr("height", height);

            // The background has a grid on top.
            grid = gauge.selectAll(".example-linear-grid")
                .data(model.data);

            grid.enter()
                .append("g")
                .attr("class", "example-linear-grid");

            grid.attr("transform", "translate(0," + height + ")")
                .call(d3.svg.axis().scale(x).ticks(50).tickSize(-height))
                .selectAll(".example-linear-tick")
                .data(x.ticks(10), function(d) { return d; })
                .exit()
                .classed("example-linear-minor", true);

            // The background has an axis drawn at the bottom of it.
            axis = gauge.selectAll(".example-linear-axis")
                .data(model.data);

            axis.enter()
                .append("g")
                .attr("class", "example-linear-axis");

            axis.attr("transform", "translate(0," + height + ")")
                .call(d3.svg.axis().scale(x).ticks(10));

            // The data bar is drawn on top.
            bar = gauge.selectAll(".example-linear-bar")
                .data(model.data);

            bar.enter()
                .append("g")
                .append("rect")
                .attr("class", "example-linear-bar")
                .attr("x", 0)
                .attr("y", 0);

            bar.attr("height", height / 2)
                .transition()
                .attr("fill", widget.properties().getValue("barColor"))
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

        BarGauge.prototype.doInitialize = function () {
            var that = this;



            d3.select("#barGauge")
                .append('svg')
                .attr('top', 0)
                .attr('left', 0)
                .attr('width', "100%")
                .attr('height', "100%")
                .attr('class', 'example-linear-gauge')
                .append('g')
                .attr('transform', 'translate(' + options.left + ',' + options.top + ')');


            render(that);
        };





    // return the PowerOneLine module
    return BarGauge;


});



function onDocumentReady() {
    // var powerGauge = gauge('#power-gauge', {
    //     size: 300,
    //     clipWidth: 300,
    //     clipHeight: 300,
    //     ringWidth: 60,
    //     maxValue: 100,
    //     transitionMs: 4000,
    // });
    // powerGauge.render();
    //
    // function updateReadings() {
    //     // just pump in random data here...
    //     var input =Math.random() * 100;
    //     powerGauge.update(input);
    //
    // }
    //
    // // every few seconds update reading values
    // updateReadings();
    // setInterval(function() {
    //     updateReadings();
    // }, 5 * 1000);
}

//call the gauge once the window is loaded
if ( !window.isLoaded ) {
    window.addEventListener("load", function() {
        onDocumentReady();
    }, false);
} else {
    onDocumentReady();
}