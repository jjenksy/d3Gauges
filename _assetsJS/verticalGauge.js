/**
 * Created by jjenkins on 8/23/2016.
 */
//defines my require js module
define(['d3'], function (d3) {
    'use strict';
    //create an pointless constructor
    var VerticalGauge = function () {
    };


    /**
     * Create a  VerticalGauge object
     * @type {Object}
     */
    VerticalGauge.prototype = Object.create(null);
    VerticalGauge.prototype.constructor = VerticalGauge;

    function render(bardata , barName) {
        var config = {

            vQuantitiveScale: 100,
            barWidth: 100,
            vGuideTicks: 10

        };



        var margin = {top: 30, right: 30, bottom: 40, left: 50}; // object that holds my margin data

        var height = 400 - margin.top - margin.bottom, // var for my height
            width = 200 - margin.left - margin.right; // var for my width

        var tempColor;

        // this is the color range map array todo setup range
        var colors = d3.scale.linear()
            .domain([0, bardata.length * .33, bardata.length * .66, bardata.length])
            .range(['#B58929', '#C61C6F', '#268BD2', '#85992C']);

        //set the fixed scale of the y bar QuantitiveScale
        var yScale = d3.scale.linear()
            .domain([0, config.vQuantitiveScale])
            .range([0, height]);

        //the xscale for my bars xValues
        var xScale = d3.scale.ordinal()
            .domain(barName)
            .rangeBands([0, width], 0.2);


        var tooltip = d3.select('body').append('div')
            .style('position', 'absolute')
            .style('padding', '0 10px')
            .style('background', 'white')
            .style('opacity', 0);

        var val = d3.select('#verticalGauge').append('div')
            .style('position', 'absolute')
            .style('padding', '0 20px')
            .style('opacity', 0);


        //----------------------alarm area svg
        var alarmChart = d3.select('#verticalGauge').append('svg')
            .attr("class", "svg_")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height  + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
            .selectAll('rect').data(bardata)
            .enter().append('rect')
            .style('fill', function (d, i) {
                return 'red'; //todo make a map of colors
            })
            .attr('width', 50) //width of bar
            .attr('y', height); //positions to gauge correctly on the y axis

        //alarm bar test area
        alarmChart.transition()
            .attr('height', function () {
                //sets the height of the alarm bar
                return yScale(100);
            })
            .attr('y', function () {
                return height - yScale(100);
            })
            .delay(function (d, i) {
                return i * 20;
            })
            .duration(1000)
            .ease('elastic');

        var myChart =  d3.select('.svg_')
            .style('background', '#E7E0CB')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
            .selectAll('rect').data(bardata)
            .enter().append('rect')
            .style('fill', function (d, i) {
                return 'steelblue'; //todo make a map of colors
            })
            .attr('width', config.barWidth) //width of bar
            .attr('y', height); //positions to gauge correctly on the y axis




        /**********************
         * @update update and transition the gauge
         * @param trans
         */
        function update(trans , name) {
            myChart.transition()
                .attr('height', function () {
                    //update the dom with our current value
                    val.html("Current " +name+": "+ trans);
                    return yScale(trans);
                })
                .attr('y', function () {
                    return height - yScale(trans);
                })
                .style('opacity', .9)//set the opacity for the value bar
                .delay(function (d, i) {
                    return i * 20;
                })
                .duration(1000)
                .ease('elastic');

            // myChart.on('mouseover', function () { //tooltip for my mouseover
            //     tooltip.transition()
            //         .style('opacity', .9);
            //     tooltip.html(trans)
            //         .style('left', (d3.event.pageX - 35) + 'px')
            //         .style('top', (d3.event.pageY - 30) + 'px');
            //     tempColor = this.style.fill;
            //     d3.select(this)
            //         .style('opacity', .5)
            //         .style('fill', 'yellow')
            // }).on('mouseout', function () {
            //     console.log(this);
            //     d3.select(this)
            //         .style('opacity', 1)
            //         .style('fill', tempColor)
            // });
            hGuide.html(trans);


        }


        //create the vertical guide
        var vGuideScale = d3.scale.linear()
            .domain([0, config.vQuantitiveScale])
            .range([height, 0]);


        //place the vguide scale and set the ticks
        var vAxis = d3.svg.axis()
            .scale(vGuideScale)
            .orient('left')
            .ticks(config.vGuideTicks);

        var vGuide = d3.select('svg').append('g');
        vAxis(vGuide);
        vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');//adds padding to align the guide
        vGuide.selectAll('path')
            .style({fill: 'none', stroke: "#000"});
        vGuide.selectAll('line')
            .style({stroke: "#000"});

        // horizantal axis
        var hAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');

        var hGuide = d3.select('svg').append('g');
        hAxis(hGuide);
        hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')');
        hGuide.selectAll('path')
            .style({ fill: 'none', stroke: "#000"});
        hGuide.selectAll('line')
            .style({  stroke: "#000"});

        return {update : update};
    }



    var test = render([0],['Voltage']);
    //data simulator
    function updateReadings() {
        // just pump in random data here...
        var input = Math.round(Math.random() * 90 +10);
        test.update(input, 'Voltage');


    }



    updateReadings();
    setInterval(function () {
        updateReadings();
    }, 5 * 1000);


    // return the PowerOneLine module
    return VerticalGauge;


});



