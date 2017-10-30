// メモ画面情報
const MEMO01_ROW = 5; // メモ01行
const MEMO01_COL = 4; // メモ01列
const MEMO02_ROW = 7; // メモ02行
const MEMO02_COL = 2; // メモ02列

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ メモ画面
/ 2017/10作成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// メモ画面行列
// レイアウトが変わるようであれば都度変更
var memoList1 = document.getElementById("memoList1");
var memoList2 = document.getElementById("memoList2");

// メモ画面
// 1
for (i = 0; i < MEMO01_ROW; i++) {
	// http://javascript123.seesaa.net/article/390980127.html
	// 行追加
	rows = memoList1.insertRow(-1);

	for (j = 0; j < MEMO01_COL; j++) {
		cells = rows.insertCell(-1);
		cells.textContent = "Memo";
		if ((j % 2) == 0) {
			cells.setAttribute("class", "white");
		} else {
			cells.setAttribute("class", "black")
		}
	}
}

// 2
for (i = 0; i < MEMO02_ROW; i++) {
	// http://javascript123.seesaa.net/article/390980127.html
	// 行追加
	rows = memoList2.insertRow(-1);

	for (j = 0; j < MEMO02_COL; j++) {
		rows.insertCell(-1).textContent = "Memo";
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ メモ画面
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// 1
function memoTableOne() {
	var i, j, k, l, tmp1, tmp2;
	var row = MEMO01_ROW;
	var col = MEMO01_COL / 2;
	var itemNum = 16; // 1項目16ワード
	var itemSeparate = 10; // 1項目10+6ワード

	for (i = 0; i < col; i++) { // 各列
		for (j = 0; j < row; j++) { // 各行
			for (k = 0; k < itemNum; k++) {
				if (k == 0) { // 初期化
					tmp1 = "";
					tmp2 = "";
				}
				l = dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][MEMO01_S + (itemNum * j) + (itemNum * row * i) + k];

				if (k < itemSeparate) { // 白背景部分
					if (l !== "0000") { // "0000"は何も入力されていないと見做す
						tmp1 += l;
					}
				} else { // 黒背景部分
					if (l !== "0000") {
						tmp2 += l; // "0000"は何も入力されていないと見做す
					}
				}
			}
			txtDecode(tmp1, j, i * 2, "memo1");
			txtDecode(tmp2, j, i * 2 + 1, "memo1");
		}
	}
}

// 2
function memoTableTwo() {
	var i, j, k, l, tmp;
	var row = MEMO02_ROW;
	var col = MEMO02_COL;
	var itemNum = 16; // 1項目16ワード

	for (i = 0; i < col; i++) { // 各列
		for (j = 0; j < row; j++) { // 各行
			for (k = 0; k < itemNum; k++) {
				if (k == 0) tmp = ""; // 初期化
				l = dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][MEMO02_S + (itemNum * j) + (itemNum * row * i) + k];

				if (l === "0000") break; // "0000"は何も入力されていないと見做す
				tmp += l;
			}
			txtDecode(tmp, j, i, "memo2");
		}
	}
}
