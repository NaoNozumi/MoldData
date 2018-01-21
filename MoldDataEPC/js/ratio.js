/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/
/ 2018/01作成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 初期化
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// 点火率画面
let ratioUp = document.getElementById("ratioUp");
let ratioCorner = document.getElementById("ratioCorner");
let ratioDown = document.getElementById("ratioDown");
let clsRatio = document.getElementById("clsRatio");

// 点火率画面情報
let RATIO_UP_ROW = 9; // 上ヒータ行数(標準:9)
let RATIO_UP_COL = 19; // 上ヒータ列数(標準:19)
let RATIO_CORNER = 2; // U字ヒータ数(標準:2)
let RATIO_DOWN_ROW = 9; // 下ヒータ行数(標準:9)
let RATIO_DOWN_COL = 19; // 下ヒータ列数(標準:19)

let RATIO_UP_ROW_HEADER = new Array(" ", 9, 8, 7, 6, 5, 4, 3, 2, 1); // 上の行
let RATIO_UP_COL_HEADER = new Array(19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1); // 上の列
let RATIO_DOWN_ROW_HEADER = new Array(" ", 9, 8, 7, 6, 5, 4, 3, 2, 1); // 下の行
let RATIO_DOWN_COL_HEADER = new Array(19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1); // 下の列

// ヒータ画面情報
const CLS_PEHEATING_NUM = 30; // CLSヒータ予熱温度点数
const CLS_OPERATION_NUM = 30; // CLSヒータ運転温度点数
const CLS_ROW = 5; // CLSヒータ行数(標準:5)
const CLS_COL = 6; // CLSヒータ列数(標準:6)
const CLS_CORNER = 1; // CLSコーナヒータ数

// 型データ構成
// 「0」始まりとします。
let RATIO_UP_S = 0; // 上ヒータ点火率開始アドレス
let RATIO_U_S = 171; // U字ヒータ開始アドレス(標準:171)
let RAITO_DOWN_S = 512; // 下ヒータ点火率開始アドレス

const CLS_RATIO_S = 0; // CLSヒータ点火率開始アドレス

// 点火率色設定
let ratio_color = new Array(10);
ratio_color = ["#00FFFF", "#5FFFBF", "#7FFF7F", "#BFFF7F", " #FFFF7F", "#FFFF00", "#FFBF00", "#FF7F00", "#FF3F00", "#FF0000"];

// 初期化
makeRatioTable();
makeCLSRatioTable();

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 点火率画面生成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function makeRatioTable() {
	let i, j;
	let rows;

	// 上ヒータ
	for (i = 0; i <= RATIO_UP_ROW; i++) {
		// 行追加
		rows = ratioUp.insertRow(-1);
		rows.appendChild(document.createElement("th")).textContent = RATIO_UP_ROW_HEADER[i];

		for (j = 0; j < RATIO_UP_COL; j++) {
			// コメント/値セル追加
			if (i == 0) {
				rows.appendChild(document.createElement("th")).textContent = RATIO_UP_COL_HEADER[j];
			} else {
				rows.insertCell(-1).textContent = 0;
			}
		}
	}

	// U字ヒータ
	rows = ratioCorner.insertRow(-1);
	for (i = 0; i < RATIO_CORNER; i++) {
		rows.appendChild(document.createElement("th")).textContent = "U字" + i;
	}
	rows = ratioCorner.insertRow(-1);
	for (i = 0; i < RATIO_CORNER; i++) {
		rows.insertCell(-1).textContent = 0;
	}

	// 下ヒータ
	for (i = 0; i <= RATIO_DOWN_ROW; i++) {
		// 行追加
		rows = ratioDown.insertRow(-1);
		rows.appendChild(document.createElement("th")).textContent = RATIO_DOWN_ROW_HEADER[i];

		for (j = 0; j < RATIO_DOWN_COL; j++) {
			// コメント/値セル追加
			if (i == 0) {
				rows.appendChild(document.createElement("th")).textContent = RATIO_DOWN_COL_HEADER[j];
			} else {
				rows.insertCell(-1).textContent = 0;
			}
		}
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ CLSヒータ画面生成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// CLS点火率
function makeCLSRatioTable() {
	let i, j, k, l;

	for (i = 0; i < CLS_ROW * 2; i++) { // 行
		// 行追加
		rows = clsRatio.insertRow(-1);

		for (j = 0; j < CLS_COL; j++) { // 列
			// コメント/値セル追加
			if ((i % 2) == 0) {
				rows.appendChild(document.createElement("th")).textContent = (i / 2) * CLS_COL + j + 1;
			} else {
				rows.insertCell(-1).textContent = 0;
			}
		}
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 上下ヒータ点火率画面
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// 上ヒータ
function upperHeaterRatio() {
	let i, j, k, l;

	for (i = 0; i < RATIO_UP_ROW; i++) { // 各行
		for (j = 0; j < RATIO_UP_COL; j++) { // 各列
			l = dataList[RATIO_UP_S + RATIO_UP_COL * (RATIO_UP_ROW - i) - j - 1];
			if (isNaN(l)) l = 0; // 数値でない場合は0
			ratioUp.rows[i + 1].cells[j + 1].textContent = l;

			// 点火率色
			k = ratioColor(l);
			ratioUp.rows[i + 1].cells[j + 1].style.backgroundColor = ratio_color[k];
		}
	}

	// U字ヒータ
	for (i = 0; i < RATIO_CORNER; i++) {
		l = dataList[RATIO_U_S + i];
		if (isNaN(l)) l = 0; // 数値でない場合は0
		ratioCorner.rows[1].cells[i].textContent = l;

		// 点火率色
		k = ratioColor(l);
		ratioCorner.rows[1].cells[i].style.backgroundColor = ratio_color[k];
	}
}

/*
// 下ヒータ
*/
function lowerHeaterRatio() {
	let i, j, k, l;

	for (i = 0; i < RATIO_DOWN_ROW; i++) { // 各行
		for (j = 0; j < RATIO_DOWN_COL; j++) { // 各列
			l = dataList[RAITO_DOWN_S + RATIO_DOWN_COL * (RATIO_DOWN_ROW - i) - j - 1];
			if (isNaN(l)) l = 0; // 数値でない場合は0
			ratioDown.rows[i + 1].cells[j + 1].textContent = l;

			// 点火率色
			k = ratioColor(l);
			ratioDown.rows[i + 1].cells[j + 1].style.backgroundColor = ratio_color[k];
		}
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ CLSヒータ画面
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// CLS点火率
function clsHeaterRatio() {
	let i, j, k, l;

	for (i = 0; i < CLS_ROW; i++) { // 各行
		for (j = 0; j < CLS_COL; j++) { // 各列
			l = parseInt(dataList[CLS_RATIO_S + CLS_COL * (CLS_ROW - i) - j - 1], 10);
			if (isNaN(l)) l = 0; // 数値でない場合は0
			clsRatio.rows[i * 2 + 1].cells[j].textContent = l / 10;

			// 点火率色
			k = ratioColor(l);
			clsRatio.rows[i * 2 + 1].cells[j].style.backgroundColor = ratio_color[k];
		}
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 点火率色(1~100を10段階に変換)
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function ratioColor(e) {
	let i;

	e = parseInt(e, 10);
	i = 0;
	if (e == 0) {
		i = 0;
	} else if (1 <= e && e <= 100) {
		i = Math.ceil(e / 10) - 1;
	}

	return i;
}
