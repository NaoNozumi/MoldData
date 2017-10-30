 // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 初期設定
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// SVG領域サイズ
var svgWidth = 800;
var svgHeight = 600;
var padding = 60; // グラフの余白
var xyAxisMargin = 1.0;
// SVGの表示領域を生成
var svg;
var svg2;
// 描画点数
var plotSize = 100;
var moldSumSize = 5;
//var maxFormingPressure = 0.98; // 最大成形圧空圧[MPa]
// http://d.hatena.ne.jp/do_aki/20130225/1361763613
// (1) BOM の用意
var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// CSVファイル生成
// http://shiba-sub.sakuraweb.com/?p=6165
// http://d.hatena.ne.jp/do_aki/20130225/1361763613
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function makeCSV(data, id, filename) {
    var a = document.getElementById(id);

    // (2) CSV データの用意
    data = data.map(function(l) {
        return l.join(",");
    }).join("\r\n");
    // (3) BOM 付き CSV ファイルの元となる Blob を作成
    var blob = new Blob([bom, data], {
        type: "text/csv"
    });
    // (4) createObjectURL を使って Blob URL を構築
    if (window.navigator.msSaveBlob) {
        // (5) IEの場合
        window.navigator.msSaveOrOpenBlob(blob, filename + ".csv");
    } else {
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        // (5) Blob URL をダウンロードさせるリンクを作る
        a.download = filename + ".csv";
        a.href = url;
    }
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 最大型締シリンダ圧力
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function cyPress2tonSet() {
    var i, j, k;
    // CSV用データ
    var csv = new Array();

    j = maxcypressresult / plotSize;
    k = maxpress / maxcypressresult;
    // 配列へのデータ格納
    for (i = 0; i < plotSize + 1; i++) {
        // CSV用データ
        csv.push(new Array(j * i * kg2MPa, k * j * i));
    }

    // グラフ領域を作成
    d3.select("#cyPress2tonGraph").selectAll("svg").remove();
    svg = d3.select("#cyPress2tonGraph")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    // スケール
    var xScale = d3.scale.linear()
        .domain([d3.min(csv, function(d) {
                return d[0];
            }),
            d3.max(csv, function(d) {
                return d[0];
            }) * xyAxisMargin
        ])
        .nice()
        .range([padding, svgWidth - padding]);
    var yScale = d3.scale.linear()
        .domain([d3.min(csv, function(d) {
                return d[1];
            }),
            d3.max(csv, function(d) {
                return d[1];
            }) * xyAxisMargin
        ])
        .nice()
        .range([svgHeight - padding, padding]);
    // 軸生成
    // グリッド生成
    // http://blog.qaramell.com/?p=12911
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(10)
        .orient("bottom")
        .innerTickSize(-(svgHeight - padding * 2))
        .outerTickSize(6)
        .tickPadding(8);
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(10)
        .orient("left")
        .innerTickSize(-(svgWidth - padding * 2))
        .outerTickSize(6)
        .tickPadding(8);
    // 折れ線生成
    var line = d3.svg.line()
        .x(function(d) {
            return xScale(d[0]);
        })
        .y(function(d) {
            return yScale(d[1]);
        });

    // 折れ線描画
    svg.append("path")
        .attr("d", line(csv))
        .attr("stroke", "#9a0079")
        .attr("fill", "none");
    // 軸描画
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, " + (svgHeight - padding) + ")")
        .call(xAxis)
        .append("text")
        .text("型締シリンダ圧[MPa]")
        .attr("text-anchor", "middle")
        .attr("x", svgWidth / 2)
        .attr("y", padding * 3 / 4);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis)
        .append("text")
        .text("型締力[ton]")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -svgHeight / 2)
        .attr("y", -padding * 3 / 4);

    // CSS
    svg.selectAll(".axis path")
        .attr("fill", "none")
        .attr("shape-rendering", "crispEdges")
        .attr("stroke", "#666666");
    svg.selectAll(".axis line")
        .attr("fill", "none")
        .attr("shape-rendering", "crispEdges")
        .attr("stroke", "#666666");
    svg.selectAll(".tick line")
        .attr("opacity", "0.3");
    svg.selectAll("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px");

    // CSVリンク生成
    csv.unshift(new Array("型締シリンダ圧[MPa]", "型締力[ton]"));
    makeCSV(csv, "csv_download", "cyPress2ton");
};

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 型締シリンダ圧力
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function cyPressSet() {
    var i, j, k, l, m, n, o, p, q;
    var color = d3.scale.category10();
    // CSV用データ
    var csv = new Array();
    var temp = new Array();
    temp.push("圧空圧力[MPa]");

    m = (formwidthmax - formwidthmin) / moldSumSize;
    n = (formlengthmax - formlengthmin) / moldSumSize;
    o = maxFormingPressure / plotSize;
    // 配列へのデータ格納
    for (i = 0; i < moldSumSize + 1; i++) {
        k = formwidthmin + m * i;
        l = formlengthmin + n * i;
        // CSV用データ
        temp.push("成形面積：巾" + k + "[mm] x 流" + l + "[mm]");
        for (j = 0; j < plotSize + 1; j++) {
            // 圧空圧
            if (i == 0) {
                // CSV用データ
                csv[j] = new Array();
                csv[j][0] = o * j;
            }
            // 型締力
            p = ((k / ten) * (l / ten) * (o * j * MPa2kg)) / 1000;
            // 型締シリンダ圧力
            q = p * (maxcypressresult / maxpress);
            if (q > maxcypressresult) {
                q = maxcypressresult * kg2MPa;
            } else if (q < mincypressresult) {
                q = mincypressresult * kg2MPa;
            } else {
                q = q * kg2MPa;
            }
            switch (i) {
                case 0:
                    csv[j][1] = q;
                    break;
                case 1:
                    csv[j][2] = q;
                    break;
                case 2:
                    csv[j][3] = q;
                    break;
                case 3:
                    csv[j][4] = q;
                    break;
                case 4:
                    csv[j][5] = q;
                    break;
                case 5:
                    csv[j][6] = q;
                    break;
            }
        }
    }

    // グラフ領域を作成
    d3.select("#formPress2tonGraph")
        .selectAll("svg").remove();
    svg2 = d3.select("#formPress2tonGraph")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    var legend = svg2.selectAll(".legend")
        .data(temp)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(560" + ", " + (i * 20 + 20) + ")";
        });
    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d, i) {
            return color(i);
        });
    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) {
            return d;
        });
    // スケール
    var xScale = d3.scale.linear()
        .domain([d3.min(csv, function(d) {
                return d[0];
            }),
            d3.max(csv, function(d) {
                return d[0];
            }) * xyAxisMargin
        ])
        .nice()
        .range([padding, svgWidth - padding]);
    var yScale = d3.scale.linear()
        .domain([d3.min(csv, function(d) {
                return d[6];
            }),
            d3.max(csv, function(d) {
                return d[6];
            }) * xyAxisMargin
        ])
        .nice()
        .range([svgHeight - padding, padding]);
    // 軸生成
    // グリッド生成
    // http://blog.qaramell.com/?p=12911
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(10)
        .orient("bottom")
        .innerTickSize(-(svgHeight - padding * 2))
        .outerTickSize(6)
        .tickPadding(8);
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(10)
        .orient("left")
        .innerTickSize(-(svgWidth - padding * 2))
        .outerTickSize(6)
        .tickPadding(8);
    // 折れ線生成
    var line1 = d3.svg.line()
        .x(function(d) {
            return xScale(d[0]);
        })
        .y(function(d) {
            return yScale(d[1]);
        });
    var line2 = d3.svg.line()
        .x(function(d) {
            return xScale(d[0]);
        })
        .y(function(d) {
            return yScale(d[2]);
        });
    var line3 = d3.svg.line()
        .x(function(d) {
            return xScale(d[0]);
        })
        .y(function(d) {
            return yScale(d[3]);
        });
    var line4 = d3.svg.line()
        .x(function(d) {
            return xScale(d[0]);
        })
        .y(function(d) {
            return yScale(d[4]);
        });
    var line5 = d3.svg.line()
        .x(function(d) {
            return xScale(d[0]);
        })
        .y(function(d) {
            return yScale(d[5]);
        });
    var line6 = d3.svg.line()
        .x(function(d) {
            return xScale(d[0]);
        })
        .y(function(d) {
            return yScale(d[6]);
        });

    // 折れ線描画
    svg2.append("path")
        .attr("d", line1(csv))
        .attr("stroke", color(1))
        .attr("fill", "none");
    svg2.append("path")
        .attr("d", line2(csv))
        .attr("stroke", color(2))
        .attr("fill", "none");
    svg2.append("path")
        .attr("d", line3(csv))
        .attr("stroke", color(3))
        .attr("fill", "none");
    svg2.append("path")
        .attr("d", line4(csv))
        .attr("stroke", color(4))
        .attr("fill", "none");
    svg2.append("path")
        .attr("d", line5(csv))
        .attr("stroke", color(5))
        .attr("fill", "none");
    svg2.append("path")
        .attr("d", line6(csv))
        .attr("stroke", color(6))
        .attr("fill", "none");
    // 軸描画
    svg2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, " + (svgHeight - padding) + ")")
        .call(xAxis)
        .append("text")
        .text("圧空圧力[MPa]")
        .attr("text-anchor", "middle")
        .attr("x", svgWidth / 2)
        .attr("y", padding * 3 / 4);
    svg2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis)
        .append("text")
        .text("型締シリンダ圧力[MPa]")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -svgHeight / 2)
        .attr("y", -padding * 3 / 4);

    // CSS
    svg2.selectAll(".axis path")
        .attr("fill", "none")
        .attr("shape-rendering", "crispEdges")
        .attr("stroke", "#666666");
    svg2.selectAll(".axis line")
        .attr("fill", "none")
        .attr("shape-rendering", "crispEdges")
        .attr("stroke", "#666666");
    svg2.selectAll(".tick line")
        .attr("opacity", "0.3");
    svg2.selectAll("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px");

    // CSVリンク生成
    csv.unshift(temp);
    makeCSV(csv, "csv_download2", "cyPress");
};

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// グラフダウンロード
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function downloadGraph(id, canvasID, linkID) {
    var svgText = document.getElementById(id).innerHTML;
    var id_a = "link" + linkID;
    var id_b = "test" + linkID;

    canvg(canvasID, svgText);
    d3.select("#" + id_a).remove();
    d3.select("#" + id_b)
        .append("a")
        .text("Download Image")
        .attr("id", id_a)
        .attr("href", document.getElementById(canvasID).toDataURL())
        .attr("download", "graph.png");
};
