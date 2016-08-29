/**
 * Created by jjenkins on 8/23/2016.
 */
//defines my require js module
define(['d3'], function (d3) {
    'use strict';

    //create an pointless constructor
    var VerticalNeedleAlarmGauge = function () {
    };


    /**
     * Create a  VerticalGauge object
     * @type {Object}
     */
    VerticalNeedleAlarmGauge.prototype = Object.create(null);
    VerticalNeedleAlarmGauge.prototype.constructor = VerticalNeedleAlarmGauge;

    function render(bardata , barName) {
        var config = {

            vQuantitiveScale: 100,
            barWidth: 100,
            vGuideTicks: 10

        };


        //alarm bar test area
        //create the data for my ticks
        var testData = 100,
            //create my color range
            tickDataArray=[];
        d3.range(testData).map(function (d) {
            if (d % 1 === 0){
                tickDataArray.push(d);
                return d;
            }

        });

        var margin = {top: 30, right: 30, bottom: 40, left: 50}; // object that holds my margin data

        var height = 400 - margin.top - margin.bottom, // var for my height
            width = 200 - margin.left - margin.right; // var for my width

        var tempColor;

        // this is the color range map array todo setup range
        var colors = d3.scale.linear()
            .domain([0, tickDataArray.length * .33, tickDataArray.length * .66, tickDataArray.length])
            .range(['red', 'yellow']);

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

        var val = d3.select('#verticalNeedleAlarmGauge').append('div')
            .style('position', 'absolute')
            .style('padding', '0 20px')
            .style('opacity', 0);





                //----------------------alarm area svg
        var x;
        //create the svg that everything lives on
        var alarmBar = d3.select('#verticalNeedleAlarmGauge')
            .append('svg')
            .attr("class", "svg_")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height  + margin.top + margin.bottom);


        var alarmHighWarn = d3.select('.svg_')
            .attr("class", "svg_")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height  + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
            .selectAll('rect').data(tickDataArray)
            .enter().append('rect')
            .attr('width', 40) //width of bar
            .attr('y', height)
            .style('fill', function(d,i) {
              //  console.log(d);
                return 'red';
            });

        alarmHighWarn.transition()
            .attr('height', function (d) {
                //sets the height of the alarm bar
                if(d<100){
                    return yScale(d);
                }

            })
            .attr('y', function (d) {
                if(d<100) {
                    return height - yScale(d);
                }
            })
            .delay(function (d, i) {
                return i * 20;
            })
            .duration(1000);

        //alarm area for high wanrning
        var alarmHighWarn = d3.select('.svg_')
            .attr("class", "svg_")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height  + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
            .selectAll('rect').data(tickDataArray)
            .enter().append('rect')
            .attr('width', 40) //width of bar
            .attr('y', height)
            .style('fill', function(d,i) {

                return 'yellow';
            });

        alarmHighWarn.transition()
            .attr('height', function (d) {
                //sets the height of the alarm bar
                if(d<90){
                    return yScale(d);
                }

            })
            .attr('y', function (d) {
                if(d<90) {
                    return height - yScale(d);
                }
            })
            .delay(function (d, i) {
                return i * 20;
            })
            .duration(1000);


        // normal green no alarm zone
        var alarmNormal = d3.select('.svg_')
            .attr("class", "svg_")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height  + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
            .selectAll('rect').data(tickDataArray)
            .enter().append('rect')
            .attr('width', 40) //width of bar
            .attr('y', height)
            .style('fill', function(d,i) {
              //
                return 'green';
            });

        alarmNormal.transition()
            .attr('height', function (d) {
                //sets the height of the alarm bar
                if(d<80){
                    return yScale(d);
                }

            })
            .attr('y', function (d) {
                if(d<80) {
                    return height - yScale(d);
                }
            })
            .delay(function (d, i) {
                return i * 20;
            })
            .duration(1000);



        var alarmLowWarn = d3.select('.svg_')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height  + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
            .selectAll('rect').data(tickDataArray)
            .enter().append('rect')
            .attr('width', 40) //width of bar
            .attr('y', height)
            .style('fill', function(d,i) {
                return 'yellow';
            });

        alarmLowWarn.transition()
            .attr('height', function (d) {
                //sets the height of the alarm bar
                if(d<40){
                    return yScale(d);
                }

            })
            .attr('y', function (d) {
                if(d<40) {
                    return height - yScale(d);
                }
            })
            .delay(function (d, i) {
                return i * 20;
            })
            .duration(1000);



        var alarmLowHigh = d3.select('.svg_')
            .attr("class", "svg_")
            .attr('width', width + margin.left + margin.right)
            .attr('height', height  + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
            .selectAll('rect').data(tickDataArray)
            .enter().append('rect')
            .attr('width', 40) //width of bar
            .attr('y', height)
            .style('fill', function(d,i) {

                return 'red';
            });

        alarmLowHigh.transition()
            .attr('height', function (d) {
                //sets the height of the alarm bar
                if(d<20){
                    return yScale(d);
                }

            })
            .attr('y', function (d) {
                if(d<20) {
                    return height - yScale(d);
                }
            })
            .delay(function (d, i) {
                return i * 20;
            })
            .duration(1000);



        //the needle area------------------
        var myChart =  d3.select('.svg_')
            .style('background', 'transparent')
            .append('g')
            .attr('transform', 'translate(' +  margin.left + ', ' + margin.top + ')')
            .selectAll('rect').data(bardata)
            .enter().append('rect')
            .attr("class", "rect")
            .style('fill', function (d, i) {
                return 'transparent'; //making tranparnet so we can debug in browser
            })
            .attr('width', 25); //width of bar


        //playing aroung with appending a triangle
       var triangle =  d3.select('.svg_')
            .append('path')
            .attr('d', function(d) {
                var x = 100, y = 100;
                return 'M ' + x +' '+ y + ' l 50 20 v -40 0 z';  // v to draw a vertical line l <num 1 extends triangle
            })
            .attr('fill', 'steelblue');
        //begin test code


        //end test code---------------------------------

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
                .style('opacity', 1)//set the opacity for the value bar
                .delay(function (d, i) {
                    return i * 20;
                })
                .duration(1000)
                .ease('elastic');

            triangle.transition()
                .attr('transform', function() {
                    var h = -70 + height - yScale(trans);
                    console.log(trans);

                return "translate(" +-50+ "," + h + ")";
            }).delay(function (d, i) {
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
            .orient('right')
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
    return VerticalNeedleAlarmGauge;


});



