
var bardata = [];
// var timeUnit = document.getElementsByClassName('time-unit')[0];
// var btn = document.getElementsByTagName('button');
var chart = document.getElementsByClassName('chart');

function createSampleData(timeframe) {
    for (var i = 0; i < timeframe; i++) {
        bardata.push(Math.round(Math.random() * 90) + 10)
    }
    generateChart();
}

function generateChart() {
    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    }

    // var oH = document.querySelector('.section').offsetHeight;
    // var oW = document.querySelector('.section').offsetWidth;

    oH = 300;
    oW = 300;
    var height = oH - margin.top - margin.bottom,
        width = oW - margin.right - margin.right,
        barWidth = 50,
        barOffset = 5;

    // var colors = d3.scale.linear()
    // .domain([0, bardata.length*.33, bardata.length*.66, bardata.length])
    // .range(['#B58929','#C61C6F', '#268BD2', '#85992C'])
    var colorScale = d3.scale.linear()
        .domain([d3.min(bardata), d3.max(bardata)])
        // .domain([0, d3.max(bardata)])
        .range(["#2bd3fc", "#2b5cfc"]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(bardata)])
        .range([0, height]);

    var xScale = d3.scale.ordinal()
        .domain(d3.range(0, bardata.length))
        .rangeBands([0, width], 0.06);
    // var xScale = d3.time.scale()
    //            .domain([new Date(2016, 4, 8), new Date(2017, 3, 7)])
    //            .range([0, width]);

    var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '4px 8px')
        .style('background', 'white')
        .style('opacity', 0);

    var myChart = d3.select('.chart').append('svg')
        .attr('class', 'bar-chart')
        .style('background', '#ffffff')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .selectAll('rect').data(bardata)
        .enter().append('rect')
        .attr('fill', function (d) {
            return colorScale(d);
        })
        // .style('fill', '#002f6c')
        .attr('width', xScale.rangeBand())
        .attr('x', function (d, i) {
            return xScale(i);
        })
        .attr('height', 0)
        .attr('y', height)

        .on('mouseover', function (d) {
            tooltip.transition()
                .style('opacity', .9)

            tooltip.html(d)
                .style('left', (d3.event.pageX - 15) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px')


            // tempColor = this.style.fill;
            d3.select(this)
                .style('opacity', .5)
            // .style('fill', 'yellow')
        })

        .on('mouseout', function (d) {
            d3.select(this)
                .style('opacity', 1)

            tooltip.transition()
                .style('opacity', 0)
            // .style('fill', tempColor)
        })

    myChart.transition()
        .attr('height', function (d) {
            return yScale(d);
        })
        .attr('y', function (d) {
            return height - yScale(d);
        })
        .delay(function (d, i) {
            return i * 20;
        })
        .duration(400)
        .ease('linear')

    var vGuideScale = d3.scale.linear()
        .domain([0, d3.max(bardata)])
        .range([height, 0])

    var vAxis = d3.svg.axis()
        .scale(vGuideScale)
        .orient('left')
        .ticks(10)

    var vGuide = d3.select('.bar-chart').append('g');
    vAxis(vGuide);

    vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    vGuide.selectAll('path')
        .style({ fill: 'none', stroke: "#000" });
    vGuide.selectAll('line')
        .style({ stroke: "#000" });

    var hAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        // .tickValues(xScale.domain().filter(function(d, i) {
        //     return !(i % (bardata.length/12));
        // }))
        .tickValues(xScale.domain())
        .tickFormat(function (d) { return d + 1; });
    // .ticks(d3.time.months)
    // .tickSize(16,0)
    // .tickFormat(d3.time.format('%B'));

    var hGuide = d3.select('.bar-chart').append('g')
    hAxis(hGuide)

    hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
    hGuide.selectAll('path')
        .style({ fill: 'none', stroke: "#000" })
    hGuide.selectAll('line')
        .style({ stroke: "#000" })

    // for (var i = 0; i < btn.length; i++) {
    //     btn[i].addEventListener('click', getButtonValue);
    // }

    // function getButtonValue() {
    //     var val = this.value;
    //     var unit = this.innerHTML;
    //     reload(val, unit);
    // }
}

function reload(val, unit) {
    d3.select('svg.bar-chart').remove();
    // d3.selectAll(tooltip).remove();
    // tooltip.selectAll("*").remove();
    // tooltip.remove();
    bardata = [];
    load(val, unit)
}

function load(dataPoints, unit) {
    createSampleData(dataPoints);
    // timeUnit.innerHTML = unit;
}

window.onload = load(12, 'Yearly');
