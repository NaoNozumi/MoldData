// ハーフサイズヒータは考慮していないバージョン(使わないで)
// 点火率画面情報
const RATIO_UP_ROW = 9; // 上ヒータ行数
const RATIO_UP_COL = 19; // 上ヒータ列数
const RATIO_CORNER = 2; // U字ヒータ数
const RATIO_DOWN_ROW = 9; // 下ヒータ行数
const RATIO_DOWN_COL = 19; // 下ヒータ列数
const FLOW = 0; // 0:正規勝手/1:反対勝手
// 点火率色設定
let ratio_color = new Array(10);
ratio_color = ["#00FFFF", "#5FFFBF", "#7FFF7F", "#BFFF7F", " #FFFF7F", "#FFFF00", "#FFBF00", "#FF7F00", "#FF3F00", "#FF0000"];

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 点火率画面
/ 2017/10作成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// 点火率画面行列
let ratioUp = document.getElementById("ratioUp");
let ratioCorner = document.getElementById("ratioCorner");
let ratioDown = document.getElementById("ratioDown");

// 上ヒータ
for (i = 0; i <= RATIO_UP_ROW; i++) {
	// http://javascript123.seesaa.net/article/390980127.html
	// 行追加
	rows = ratioUp.insertRow(-1);
	if (i == 0) {
		rows.appendChild(document.createElement("th")).textContent = " ";
	} else {
		rows.appendChild(document.createElement("th")).textContent = (RATIO_UP_ROW - i) + 1;
	}

	for (j = 0; j < RATIO_UP_COL; j++) {
		// コメント/値セル追加
		if (i == 0) {
			rows.appendChild(document.createElement("th")).textContent = RATIO_UP_COL - j;
		} else {
			rows.insertCell(-1).textContent = 0;
		}
	}
}

// U字ヒータ
// U字ヒータの数が変わったらここを編集
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
	// http://javascript123.seesaa.net/article/390980127.html
	// 行追加
	rows = ratioDown.insertRow(-1);
	if (i == 0) {
		rows.appendChild(document.createElement("th")).textContent = " ";
	} else {
		rows.appendChild(document.createElement("th")).textContent = (RATIO_DOWN_ROW - i) + 1;
	}

	for (j = 0; j < RATIO_DOWN_COL; j++) {
		// コメント/値セル追加
		if (i == 0) {
			rows.appendChild(document.createElement("th")).textContent = RATIO_DOWN_COL - j;
		} else {
			rows.insertCell(-1).textContent = 0;
		}
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 上下ヒータ点火率画面
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function upperHeaterRatio() {
	let i, j, k, l;

	for (j = RATIO_UP_COL; j > 0; j--) { // 各列
		for (i = RATIO_UP_ROW; i > 0; i--) { // 各行
			l = dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][RATIO_UP_S + (RATIO_UP_ROW - i) + (RATIO_UP_COL - j) * RATIO_UP_ROW];
			ratioUp.rows[i].cells[j].textContent = l;

			// 点火率色
			k = ratioColor(l);
			ratioUp.rows[i].cells[j].style.backgroundColor = ratio_color[k];
		}
	}

	// U字ヒータ
	for (i = 0; i < RATIO_CORNER; i++) {
		l = dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][RATIO_UP_S + RATIO_UP_ROW * RATIO_UP_COL + i + 1];
		ratioCorner.rows[1].cells[i].textContent = l;

		// 点火率色
		k = ratioColor(l);
		ratioCorner.rows[1].cells[i].style.backgroundColor = ratio_color[k];
	}
}

function lowerHeaterRatio() {
	let i, j, k, l;

	for (j = RATIO_DOWN_COL; j > 0; j--) { // 各列
		for (i = RATIO_DOWN_ROW; i > 0; i--) { // 各行
			l = dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][RAITO_DOWN_S + (RATIO_DOWN_ROW - i) + (RATIO_DOWN_COL - j) * RATIO_DOWN_ROW];
			ratioDown.rows[i].cells[j].textContent = l;

			// 点火率色
			k = ratioColor(l);
			ratioDown.rows[i].cells[j].style.backgroundColor = ratio_color[k];
		}
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 点火率色
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
