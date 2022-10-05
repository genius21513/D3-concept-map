

var i_c = [], e_c = [];

function loadMapData() {
    var exports = jsonData.Export;
    var imports = jsonData.Import;

    imports.forEach(row => {
        let o = new Array(), c_arr = new Array();
        o.push(row.GoodsName);
        for (var prop in row) {
            if (row[prop] == 'y') {
                c_arr.push(prop);
            }
        }
        o.push(c_arr);
        i_c.push(o);
    });

    exports.forEach(row => {
        let o = new Array(), c_arr = new Array();

        o.push(row.GoodsName);
        for (var prop in row) {
            if (row[prop] == 'y') {
                c_arr.push(prop);
            }
        }
        o.push(c_arr);
        e_c.push(o);
    });
}

loadMapData();
init();

function init() {

    var icl = 0, ecl = 0;    //import & export country length
    var outer = d3.map();
    var inner = [];
    var links = [];

    var outerId = [0];

    i_c.forEach(function (d) {
        i = { id: 'i' + inner.length, name: d[0], related_links: [] };
        i.related_nodes = [i.id];
        inner.push(i);

        if (!Array.isArray(d[1]))
            d[1] = [d[1]];

        d[1].forEach(function (d1) {
            o = outer.get(d1);
            if (o == null) {
                o = { name: d1, id: 'o' + outerId[0], related_links: [], type: "import" };
                o.related_nodes = [o.id];
                outerId[0] = outerId[0] + 1;
                outer.set(d1, o);
            }

            // create the links
            l = { id: 'l-' + i.id + '-' + o.id, inner: i, outer: o }
            links.push(l);

            // and the relationships
            i.related_nodes.push(o.id);
            i.related_links.push(l.id);
            o.related_nodes.push(i.id);
            o.related_links.push(l.id);
        });
    });

    icl = outerId[0];

    // export
    let k = 0;

    e_c.forEach(function (d) {
        i = inner[k++];

        if (!Array.isArray(d[1]))
            d[1] = [d[1]];

        d[1].forEach(function (d1) {
            o = outer.get(d1);
            if (o == null) {
                o = { name: d1, id: 'o' + outerId[0], related_links: [], type: "export" };
                o.related_nodes = [o.id];
                outerId[0] = outerId[0] + 1;
                outer.set(d1, o);
            }

            // create the links
            l = { id: 'l-' + i.id + '-' + o.id, inner: i, outer: o }
            links.push(l);

            // and the relationships
            i.related_nodes.push(o.id);
            i.related_links.push(l.id);
            o.related_nodes.push(i.id);
            o.related_links.push(l.id);
        });
    });

    ecl = outerId[0] - icl;

    data = {
        inner: inner,
        outer: outer.values(),
        links: links
    }


    // This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).
    var colors = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"]
    var color = d3.scale.linear()
        .domain([10, 220])
        .range([colors.length - 1, 0])
        .clamp(true);

    var oW = document.querySelector('#map').offsetWidth;
    var oH = document.querySelector('#map').offsetHeight;

    var rad = (oW > oH) ? oH : oW;

    var diameter = rad;
    var rect_width = 130;
    var rect_height = 20;

    var link_width = ".2px";

    var il = data.inner.length;
    var ol = data.outer.length;

    var inner_y = d3.scale.linear()
        .domain([0, il])
        .range([-(il * (rect_height + 1)) / 2, (il * (rect_height + 1)) / 2]);

    mid = (data.outer.length / 2.0);

    var outer_ix = d3.scale.linear()
        .domain([0, icl])
        .range([40, 140]);
    //  .range([15, 170]);

    var outer_ex = d3.scale.linear()
        .domain([0, ecl])
        .range([320, 220]);
    // .range([190, 355]);


    // var outer_ix = d3.scale.linear()
    //      .domain([0, icl])
    //      .range([-diameter/2 * .6, diameter/2 * .6]);
    //     //  .range([15, 170]);

    // var outer_ex = d3.scale.linear()
    //     .domain([0, ecl])
    //     .range([-diameter/2 * .6, diameter/2 * .6]);
    //     // .range([190, 355]);


    // setup positioning
    // data.outer = data.outer.map(function (d, i) {
    //     if (d.type == 'import') {
    //         d.x = - diameter / 3;
    //         d.y = outer_ix(i);
    //     } else {
    //         d.x = diameter / 3;
    //         d.y = outer_ex(i - icl);
    //     }
    //     return d;
    // });

    data.outer = data.outer.map(function (d, i) {
        if (d.type == 'import') {
            d.x = outer_ix(i);
        } else {
            d.x = outer_ex(i - icl);
        }

        d.y = diameter / 3;
        return d;
    });

    data.inner = data.inner.map(function (d, i) {
        d.x = -(rect_width / 2);
        d.y = inner_y(i);
        return d;
    });

    function get_color(name) {
        var c = Math.round(color(name));
        if (isNaN(c))
            return '#d9d9d9';	// fallback color

        return colors[c];
    }

    // Can't just use d3.svg.diagonal because one edge is in normal space, the
    // other edge is in radial space. Since we can't just ask d3 to do projection
    // of a single point, do it ourselves the same way d3 would do it.  


    function projectX(x) {
        return ((x - 90) / 180 * Math.PI) - (Math.PI / 2);
    }


    // var diagonal = d3.svg.diagonal()
    //     .source(function (d) {
    //         // console.log(d.outer);
    //         return {
    //             "x": d.outer.x > 0 ? d.inner.x + rect_width : d.inner.x,
    //             // "x": d.inner.x + rect_width / 2,
    //             "y": d.inner.y
    //         };
    //     })
    //     .target(function (d) {
    //         return {
    //             "x": d.outer.x > 0 ? d.outer.x - 2 : d.outer.x + 2,
    //             "y": d.outer.y
    //         };
    //     });
    //     // .projection(function (d) { return [d.x, d.y]; });


    // var line = (function (d) {
    //     var dx = d.outer.x - d.inner.x,
    //         dy = d.outer.y - d.inner.y,
    //         //dr = Math.sqrt(dx * dx + dy * dy);
    //     dr = 0;
    //     x = (d.outer.x > 0)? d.inner.x + rect_width : d.inner.x;

    //     // console.log("M" + d.inner.x + "," + d.inner.y + "A" + dr + "," + dr + " 0 0,1 " + d.outer.x + "," + d.outer.y);
    //     // return "M" + d.inner.x + "," + d.inner.y + "A" + dr + "," + dr + " 0 0,1 " + d.outer.x + "," + d.outer.y;

    //     return "M" + x + "," + d.inner.y + "L" + d.outer.x + "," + d.outer.y;
    // });


    var diagonal = d3.svg.diagonal()
        .source(function (d) {
            return {
                "x": d.outer.y * Math.cos(projectX(d.outer.x)),
                "y": -d.outer.y * Math.sin(projectX(d.outer.x))
            };
        })
        .target(function (d) {
            return {
                "x": d.inner.y + rect_height / 2,
                "y": d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width
            };
        })
        .projection(function (d) { return [d.y, d.x]; });

    var svg = d3.select("#map").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");


    // links
    var link = svg.append('g').attr('class', 'links').selectAll(".link")
        .data(data.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('id', function (d) { return d.id })
        .attr("d", diagonal)
        // .attr("d", line)
        // .attr('stroke', function (d) { return get_color(d.inner.name); })
        .attr('stroke-width', link_width);

    // outer nodes

    var onode = svg.append('g').selectAll(".outer_node")
        .data(data.outer)
        .enter().append("g")
        .attr("class", "outer_node")
        .attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
        // .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
        // .on("mouseover", mouseover)
        // .on("mouseout", mouseout)
        .on("click", mouseclick);

    onode.append("circle")
        .attr('id', function (d) { return d.id })
        .attr("r", 5);

    onode.append("circle")
        .attr('r', 20)
        .attr('visibility', 'hidden');

    onode.append("text")
        .attr('id', function (d) { return d.id + '-txt'; })
        .attr("dy", ".5em")
        // .attr("text-anchor", function (d) { return d.x < 0 ? "end" : "start"; })
        .attr("text-anchor", function (d) { return d.x < 180 ? "start" : "end"; })
        // .attr("transform", function (d) { return d.x < 0 ? "translate(-8, -2)" : "translate(8, -2)"; })
        .attr("transform", function (d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
        .text(function (d) { return d.name; });

    // inner nodes
    var inode = svg.append('g').selectAll(".inner_node")
        .data(data.inner)
        .enter().append("g")
        .attr("class", "inner_node")
        .attr("transform", function (d, i) { return "translate(" + d.x + "," + d.y + ")" })
        // .on("mouseover", mouseover)
        // .on("mouseout", mouseout)
        .on("click", mouseclick);

    inode.append('rect')
        .attr('width', rect_width)
        .attr('height', rect_height)
        // .attr('fill', function (d) { return get_color(d.name); })    
        .attr('fill', '#ededed')
        .attr('id', function (d) { return d.id; });


    inode.append("text")
        .attr('id', function (d) { return d.id + '-txt'; })
        .attr('text-anchor', 'middle')
        .attr("transform", "translate(" + rect_width / 2 + ", " + rect_height * .75 + ")")
        .text(function (d) { return d.name; });

    // need to specify x/y/etc

    // d3.select(self.frameElement).style("height", diameter - 150 + "px");

    function mouseclick(d) {
        // reload graph data
        reload(12, 'Yearly');

        // set title
        document.querySelector('.title').innerText = d.name;

        // if (d3.select('.section').attr('class').indexOf('show') < 0) {
        //     d3.select('.section').classed('show', true);
        // } else {
        //     d3.select('.section').classed('show', false);
        // }

        if (d3.select(d3.select('#' + d.id).node().parentNode).classed('clicked') > 0) {
            // Clear lines
            d3.selectAll('.inner_node')
                .classed('clicked', false)
                .each(function (d, j) {
                    for (var i = 0; i < d.related_links.length; i++) {
                        d3.select('#' + d.related_links[i]).attr('stroke-width', link_width);
                        d3.select('#' + d.related_links[i]).attr('stroke', '#D9D9D9');
                    }
                });

            // if (d3.select('.section').classed('show')) {
            //     d3.select('.section').classed('show', true);
            // } else {                
            d3.select('.section').classed('show', false);
            // }

        } else {
            d3.select('.section').classed('show', true);

            d3.selectAll('.inner_node')
                .classed('clicked', false)
                .each(function (d, j) {
                    for (var i = 0; i < d.related_links.length; i++) {
                        d3.select('#' + d.related_links[i]).attr('stroke-width', link_width);
                        d3.select('#' + d.related_links[i]).attr('stroke', '#D9D9D9');
                    }
                });
            // Sort and Draw        
            d3.select(d3.select('#' + d.id).node().parentNode).classed('clicked', true);
            d3.selectAll('.links .link').sort(function (a, b) { return d.related_links.indexOf(a.id); });

            // link line
            for (var i = 0; i < d.related_links.length; i++) {
                d3.select('#' + d.related_links[i]).attr('stroke-width', '3px');
                d3.select('#' + d.related_links[i]).attr('stroke', '#2500db');
            }
        }
    }
}






