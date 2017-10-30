// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 初期設定
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var storage = localStorage;
window.onload = function(){
	// サーボの図を描画
	drawFigure();
	// 設定値読込
	if(typeof sessionStorage !== "undefined"){
		loadStorage();
	}else{
	}
};

// テキスト
var motor;
var textA;
var textB;
var textC;
var motorRatio;
var textChain;

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// サーボ構成図描画
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function drawFigure(){
	//初期設定
	var figSvg;

	d3.select("#figure").selectAll("svg").remove();
	figSvg = d3.select("#figure")
				.append("svg")
				.attr("width", 440)
				.attr("height", 240);
	// モータ
	figSvg.append("rect").attr("fill", "url(#grad1)")
		.attr("x", 0).attr("y", 0)
		.attr("width", 80).attr("height", 60);
	// 減速機
	figSvg.append("rect")
		.attr("x", 80).attr("y", 0)
		.attr("width", 20).attr("height", 60);
	// モータ-プーリA
	figSvg.append("rect").attr("fill", "url(#grad1)")
		.attr("x", 100).attr("y", 25)
		.attr("width", 35).attr("height", 10);
	// プーリA
	figSvg.append("rect")
		.attr("x", 135).attr("y", 5).attr("fill", "url(#grad2)")
		.attr("width", 20).attr("height", 50);
	// プーリB
	figSvg.append("rect")
		.attr("x", 135).attr("y", 115).attr("fill", "url(#grad2)")
		.attr("width", 20).attr("height", 60);
	// プーリB-プーリC
	figSvg.append("rect").attr("fill", "url(#grad1)")
		.attr("x", 155).attr("y", 140)
		.attr("width", 35).attr("height", 10);
	// プーリC
	figSvg.append("rect")
		.attr("x", 190).attr("y", 110).attr("fill", "url(#grad2)")
		.attr("width", 20).attr("height", 70);
	// ベルトっぽいもの
	figSvg.append("line")
		.attr("x1", 135).attr("y1", 60).attr("x2", 135).attr("y2", 110)
		.attr("stroke", "#000000");
	figSvg.append("line")
		.attr("x1", 155).attr("y1", 60).attr("x2", 155).attr("y2", 110)
		.attr("stroke", "#000000");
	// 矢印
	var marker = figSvg.append("defs").append("marker")
						.attr({
							'id': "arrowHead",
							'refX': 8,
							'refY': 4,
							'markerWidth': 12,
							'markerHeight': 8,
							'orient': "auto"
						});
	marker.append("path")
			.attr({
				d: "M 0,0 V 8 L12,4 Z",
				fill: "#000000"
			});
	// 矢印
	var gradient = figSvg.append("linearGradient")
					.attr({
						'id': "grad1",
						'x1': "0%",
						'y1': "0%",
						'x2': "0%",
						'y2': "100%",
					});
	var gradient2 = figSvg.append("linearGradient")
					.attr({
						'id': "grad2",
						'x1': "0%",
						'y1': "0%",
						'x2': "0%",
						'y2': "100%",
					});
	gradient.append("stop")
		.attr({
			'offset': "0%",
			'stop-color': "#333333"
		});
	gradient.append("stop")
		.attr({
			'offset': "50%",
			'stop-color': "#999999"
		});
	gradient.append("stop")
		.attr({
			'offset': "100%",
			'stop-color': "#333333"
		});
	gradient2.append("stop")
		.attr({
			'offset': "0%",
			'stop-color': "#2e3434"
		});
	gradient2.append("stop")
		.attr({
			'offset': "50%",
			'stop-color': "#899a9a"
		});
	gradient2.append("stop")
		.attr({
			'offset': "100%",
			'stop-color': "#2e3434"
		});
	// 引き出し線
	var i = [205,185]; var j = [215,220]; var k = [240,220];
	var linePoints = [k, j, i];
	var line = d3.svg.line()
				.x(function(d){return d[0];})
				.y(function(d){return d[1];});
	figSvg.append("path")
		.attr({
			"d": line(linePoints),
			"stroke": "#000000",
			"stroke-width": 1,
			"fill": "none",
			"marker-end": "url(#arrowHead)"
		});
	// テキスト
	motor =figSvg.append("text")
				.attr({
					"id": "motor",
					"x": 10,
					"y": 80,
					"text-anchor": "start",
					"fill":	"#000000"
				});
	motorRatio =figSvg.append("text")
				.attr({
					"id": "motorRatio",
					"x": 10,
					"y": 100,
					"text-anchor": "start",
					"fill":	"#000000"
				});
	textA =figSvg.append("text")
				.attr({
					"id": "pullyA",
					"x": 170,
					"y": 45,
					"text-anchor": "start",
					"fill":	"#000000"
				});
	textB = figSvg.append("text")
				.attr({
					"id": "pullyB",
					"x": 120,
					"y": 160,
					"text-anchor": "end",
					"fill":	"#000000"
				});
	textC = figSvg.append("text")
				.attr({
					"id": "pullyC",
					"x": 245,
					"y": 210,
					"text-anchor": "start",
					"dy": ".35em",
					"fill":	"#000000"
				});
	textChain = figSvg.append("text")
				.attr({
					"id": "chain",
					"x": 245,
					"y": 230,
					"text-anchor": "start",
					"dy": ".35em",
					"fill":	"#000000"
				});
	motor.text("モータ");
	motorRatio.text("");
	textA.text("A");
	textB.text("B");
	textC.text("C");
	textChain.text("");
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// localStorage読込
// http://forse.hatenablog.com/entry/2014/06/23/123042
// http://perutago.seesaa.net/article/206013819.html
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function loadStorage(){
	for(var i = 0; i < storage.length; i++){
		var key = storage.key(i);
		var element = document.getElementById(key);

		if(element){
			element.value = storage.getItem(key);
		}
	}
};
				
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 入力パラメータの保存
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function paramSet(){
	var inputValue = [0,0,0,0,0,0,0,0];

	// 値取得
	inputValue[0] = document.getElementById("teethA").value;
	inputValue[1] = document.getElementById("teethB").value;
	inputValue[2] = document.getElementById("teethC").value;
	inputValue[3] = document.getElementById("chainlength").value;
	inputValue[4] = document.getElementById("ratio").value;
	inputValue[5] = document.getElementById("ratioNumer").value;
	inputValue[6] = document.getElementById("maxspeed").value;
	inputValue[7] = document.getElementById("encpls").value;

	// localStorageに保存
	storage.setItem("teethA", inputValue[0]);
	storage.setItem("teethB", inputValue[1]);
	storage.setItem("teethC", inputValue[2]);
	storage.setItem("chainlength", inputValue[3]);
	storage.setItem("ratio", inputValue[4]);
	storage.setItem("ratioNumer", inputValue[5]);
	storage.setItem("maxspeed", inputValue[6]);
	storage.setItem("encpls", inputValue[7]);
};
