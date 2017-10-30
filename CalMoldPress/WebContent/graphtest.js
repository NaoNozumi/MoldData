 // グラフ生成のテスト
// 使用データ
var sampleData = [
    [0, 0],
    [0.09448107569974402, 3.9999999999999996],
    [0.18896215139948805, 7.999999999999999],
    [0.2834432270992321, 11.999999999999998],
    [0.3779243027989761, 15.999999999999998],
    [0.4724053784987201, 20]
];

// SVG領域サイズ
var svgWidth = 640;
var svgHeight = 480;
var padding = 40; // グラフの余白
var xAxisPadding = 40; // x軸表示余白
var yAxisPadding = 40; // y軸表示余白

// SVG領域
// SVG領域追加
var svg = d3.select("#graph")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
d3.select("#testArea").selectAll("p")
    .data(sampleData)
    .enter()
    .append("p")
    .text(function(d) {
        return d;
    });
// スケール
var xAxisScale = d3.scale.linear()
    .domain([d3.min(sampleData, function(d) {
            return d[0];
        }),
        1.5 * d3.max(sampleData, function(d) {
            return d[0];
        })
    ])
    .nice()
    .range([padding, svgWidth - padding]);
var yAxisScale = d3.scale.linear()
    .domain([d3.min(sampleData, function(d) {
            return d[1];
        }),
        1.5 * d3.max(sampleData, function(d) {
            return d[1];
        })
    ])
    .nice()
    .range([svgHeight - padding, padding]);
// 軸生成
var xAxis2 = d3.svg.axis()
    .scale(xAxisScale)
    .orient("bottom")
    .ticks(5);
var yAxis2 = d3.svg.axis()
    .scale(yAxisScale)
    .orient("left")
    .ticks(5);
//散布図生成
svg.selectAll("circle")
    .data(sampleData)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
        return xAxisScale(d[0]);
    })
    .attr("cy", function(d) {
        return yAxisScale(d[1]);
    })
    .attr("r", 2);
//軸生成
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (svgHeight - xAxisPadding) + ")")
    .call(xAxis2);
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + yAxisPadding + ", 0)")
    .call(yAxis2);
