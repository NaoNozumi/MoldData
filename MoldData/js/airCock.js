// エアコック画面デザイン
const holeFlow_NUM = 97; // 流れ穴個数
const holeWidth_NUM = 85; // 幅穴個数
const cockFlow_NUM = 23; // 流れコック個数
const cockWidth_NUM = 19; // 幅コック個数
const holePitchPX = 7; // 穴ピッチ[px]
const cockBtnStage = 4; // エアコックボタン並び個数
const cockBtnShort = holePitchPX * cockBtnStage;
const cockBtnLong = cockBtnShort * 1.5;

const airCockWidth = (holeFlow_NUM - 1) * holePitchPX + (cockBtnShort - holePitchPX);
const airCockHeight = (holeWidth_NUM - 1) * holePitchPX + (cockBtnShort - holePitchPX);

const COCK_A_S = 1296 + cockWidth_NUM - 1; // A:1~19
const COCK_B_S = 1320 + cockFlow_NUM - 1; // B:A~W
const COCK_C_S = 1368 + cockFlow_NUM - 1; // C:A~W
const COCK_D_S = 1344 + cockWidth_NUM - 1; // D:1~19

const COCK_ALPHA = Range("A", cockFlow_NUM); // エアコック記号
const cockFontSize = cockBtnShort * 0.7; // コック名称フォントサイズ

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ エアコック画面を描く
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
let cockCanvas = document.getElementById("airCock");
cockCanvas.setAttribute("width", airCockWidth);
cockCanvas.setAttribute("height", airCockHeight);

if (!cockCanvas || !cockCanvas.getContext) {
	alert("canvasが利用できるWebブラウザで開いてください。");
}

// 2Dコンテキスト
let cockCanvasCtx = cockCanvas.getContext("2d");
cockCanvasCtx.font = cockFontSize + "px sans-serif";
cockCanvasCtx.textAlign = "center";

// 描画
airCockDraw();
/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ エアコック画面描画
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function airCockDraw() {
	let i, j, k, l, m, n;
	let xx, yy;
	let x, y, width, height;
	let text;

	// クリア
	cockCanvasCtx.clearRect(0, 0, cockCanvas.width, cockCanvas.height);

	// センター
	width = (holeFlow_NUM - cockFlow_NUM * 2 - 1) * holePitchPX;
	height = (holeWidth_NUM - cockWidth_NUM * 2 - 1) * holePitchPX;
	x = (airCockWidth - width) / 2;
	y = (airCockHeight - height) / 2;
	cockCanvasCtx.strokeRect(x, y, width, height);
	// A,B,C,D
	cockCanvasCtx.fillStyle = "#000080";
	cockCanvasCtx.fillText("A", x + width / 2, y + height / 8);
	cockCanvasCtx.fillText("B", x + width / 8, y + height / 2);
	cockCanvasCtx.fillText("C", x + width * 7 / 8, y + height / 2);
	cockCanvasCtx.fillText("D", x + width / 2, y + height * 7 / 8);

	//
	xx = (cockBtnShort - holePitchPX) / 2;
	yy = (cockBtnShort - holePitchPX) / 2;
	// 幅(A,D)
	j = (holeFlow_NUM - 1) * holePitchPX;
	for (i = 0; i < cockWidth_NUM; i++) {
		//
		(dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][COCK_A_S - i] == 1) ? cockCanvasCtx.fillStyle = "#ffbf00": cockCanvasCtx.fillStyle = "#ffffff"; // 色
		cockCanvasCtx.fillRect(xx, i * holePitchPX + yy, j, holePitchPX);
		cockCanvasCtx.strokeRect(xx, i * holePitchPX + yy, j, holePitchPX);
		// 反転
		(dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][COCK_D_S - i] == 1) ? cockCanvasCtx.fillStyle = "#ffbf00": cockCanvasCtx.fillStyle = "#ffffff"; // 色
		cockCanvasCtx.fillRect(xx, airCockHeight - (i + 1) * holePitchPX - yy, j, holePitchPX);
		cockCanvasCtx.strokeRect(xx, airCockHeight - (i + 1) * holePitchPX - yy, j, holePitchPX);
	}
	//
	j = 0;
	k = airCockWidth / 2 - cockBtnLong * (cockBtnStage / 2);
	for (i = 0; i < cockWidth_NUM; i++) {
		//
		(dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][COCK_A_S - i] == 1) ? cockCanvasCtx.fillStyle = "#ffbf00": cockCanvasCtx.fillStyle = "#bfbfbf"; // 色
		cockCanvasCtx.fillRect(k + j * cockBtnLong, i * holePitchPX, cockBtnLong, cockBtnShort);
		cockCanvasCtx.strokeRect(k + j * cockBtnLong, i * holePitchPX, cockBtnLong, cockBtnShort);
		// 文字
		cockCanvasCtx.fillStyle = "#000000";
		cockCanvasCtx.fillText(i + 1, k + j * cockBtnLong + cockBtnLong / 2, i * holePitchPX + cockBtnShort / 2 + cockFontSize / 2);
		// 反転
		(dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][COCK_D_S - i] == 1) ? cockCanvasCtx.fillStyle = "#ffbf00": cockCanvasCtx.fillStyle = "#bfbfbf"; // 色
		cockCanvasCtx.fillRect(k + j * cockBtnLong, airCockHeight - (i + 1) * holePitchPX - cockBtnShort, cockBtnLong, cockBtnShort);
		cockCanvasCtx.strokeRect(k + j * cockBtnLong, airCockHeight - (i + 1) * holePitchPX - cockBtnShort, cockBtnLong, cockBtnShort);
		// 文字
		cockCanvasCtx.fillStyle = "#000000";
		cockCanvasCtx.fillText(i + 1, k + j * cockBtnLong + cockBtnLong / 2, airCockHeight - (i + 1) * holePitchPX - cockBtnShort + cockBtnShort / 2 + cockFontSize / 2);
		(j < 3) ? j++ : j = 0;
	}

	// 流れ(B,C)
	j = (holeWidth_NUM - cockWidth_NUM * 2 - 1) * holePitchPX;
	for (i = 0; i < cockFlow_NUM; i++) {
		//
		(dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][COCK_B_S - i] == 1) ? cockCanvasCtx.fillStyle = "#ffbf00": cockCanvasCtx.fillStyle = "#ffffff"; // 色
		cockCanvasCtx.fillRect(i * holePitchPX + xx, y, holePitchPX, j);
		cockCanvasCtx.strokeRect(i * holePitchPX + xx, y, holePitchPX, j);
		// 反転
		(dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][COCK_C_S - i] == 1) ? cockCanvasCtx.fillStyle = "#ffbf00": cockCanvasCtx.fillStyle = "#ffffff"; // 色
		cockCanvasCtx.fillRect(airCockWidth - (i + 1) * holePitchPX - xx, y, holePitchPX, j);
		cockCanvasCtx.strokeRect(airCockWidth - (i + 1) * holePitchPX - xx, y, holePitchPX, j);
	}
	//
	j = 0;
	k = airCockHeight / 2 - cockBtnLong * (cockBtnStage / 2);
	for (i = 0; i < cockFlow_NUM; i++) {
		//
		(dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][COCK_B_S - i] == 1) ? cockCanvasCtx.fillStyle = "#ffbf00": cockCanvasCtx.fillStyle = "#bfbfbf"; // 色
		cockCanvasCtx.fillRect(i * holePitchPX, k + j * cockBtnLong, cockBtnShort, cockBtnLong);
		cockCanvasCtx.strokeRect(i * holePitchPX, k + j * cockBtnLong, cockBtnShort, cockBtnLong);
		// 文字
		cockCanvasCtx.fillStyle = "#000000";
		cockCanvasCtx.fillText(COCK_ALPHA[i], i * holePitchPX + cockBtnShort / 2, k + j * cockBtnLong + cockBtnLong / 2 + cockFontSize / 2);
		// 反転
		(dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][COCK_C_S - i] == 1) ? cockCanvasCtx.fillStyle = "#ffbf00": cockCanvasCtx.fillStyle = "#bfbfbf"; // 色
		cockCanvasCtx.fillRect(airCockWidth - (i + 1) * holePitchPX - cockBtnShort, k + j * cockBtnLong, cockBtnShort, cockBtnLong);
		cockCanvasCtx.strokeRect(airCockWidth - (i + 1) * holePitchPX - cockBtnShort, k + j * cockBtnLong, cockBtnShort, cockBtnLong);
		// 文字
		cockCanvasCtx.fillStyle = "#000000";
		cockCanvasCtx.fillText(COCK_ALPHA[i], airCockWidth - (i + 1) * holePitchPX - cockBtnShort + cockBtnShort / 2, k + j * cockBtnLong + cockBtnLong / 2 + cockFontSize / 2);
		(j < 3) ? j++ : j = 0;
	}
}


/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ アルファベット配列
/ http://yoppy.hatenablog.jp/entry/2017/06/10/192319
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function Range(st, num) {
	let first = st.charCodeAt(0);
	let result = new Array();

	for (let i = 0; i < num; i++) {
		result.push(String.fromCodePoint(first));
		first++;
	}
	return result;
}
