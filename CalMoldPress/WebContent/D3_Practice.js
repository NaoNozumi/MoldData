/**
 * D3.jsサンプル
 */

/*
	初期化
*/
d3.select("body").append("h1").text("SVGのテスト");
d3.select("body").append("p").text("D3.jsを用いたグラフの作成テスト");
d3.select("body").append("hr");
d3.select("body").append("address").text("Nao wiz Coa");

// 使用データ
var dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
    11, 12, 15, 20, 18, 17, 16, 18, 23, 25
];
// ランダムデータセット
var dataset2 = [];
var numDataPoints = 10;
var xRange = Math.random() * 1000;
var yRange = Math.random() * 1000;
for (var i = 0; i < numDataPoints; i++) {
    var newNumber1 = Math.round(Math.random() * xRange);
    var newNumber2 = Math.round(Math.random() * yRange);
    dataset2.push([newNumber1, newNumber2]);
}

// D3.js入門
var w = 580;
var h = 280;
var barPadding = 1;
var graphPadding = 40;
var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset2, function(d) {
        return d[0];
    })])
    .range([graphPadding, w - graphPadding * 2]);
var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset2, function(d) {
        return d[1];
    })])
    .range([h - graphPadding, graphPadding]);
var rScale = d3.scale.linear()
    .domain([0, d3.max(dataset2, function(d) {
        return d[1];
    })])
    .range([2, 5]);
var formatAsxAxis = d3.format("e");
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(5)
    .tickFormat(formatAsxAxis);
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5);
// svg領域
var d3Svg = d3.select("#primer")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
var d3Svg2 = d3.select("#primer")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
// 棒グラフ生成
d3Svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
        return i * (w / dataset.length);
    })
    .attr("y", function(d) {
        return h - d * 4;
    })
    .attr("width", w / dataset.length - barPadding)
    .attr("height", function(d) {
        return d * 4;
    })
    .attr("fill", function(d) {
        return "rgb(0, 0, " + (d * 10) + ")";
    });
// テキストラベル生成
d3Svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
        return d;
    })
    .attr("text-anchor", "middle")
    .attr("x", function(d, i) {
        return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
    })
    .attr("y", function(d) {
        return h - (d * 4) + 14;
    })
    .attr("fill", "white");
// 散布図生成
d3Svg2.selectAll("circle")
    .data(dataset2)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
        return xScale(d[0]);
    })
    .attr("cy", function(d) {
        return yScale(d[1]);
    })
    .attr("r", function(d) {
        return rScale(d[1]);
    });
// テキストラベル生成
d3Svg2.selectAll("text")
    .data(dataset2)
    .enter()
    .append("text")
    .text(function(d) {
        return "(" + d[0] + "," + d[1] + ")";
    })
    .attr("x", function(d) {
        return xScale(d[0]);
    })
    .attr("y", function(d) {
        return yScale(d[1]);
    })
    .attr("fill", "red");
// 軸生成
d3Svg2.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (h - graphPadding) + ")")
    .call(xAxis);
d3Svg2.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + graphPadding + ", 0)")
    .call(yAxis);
