/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ comment.txt編集テスト
/ Handsontable
/ https://qiita.com/opengl-8080?page=3
/ 2017/11作成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
let dispData = new Array();
let deviceTable = document.getElementById("deviceTable"); // テーブル
let deviceHOT = new Handsontable(deviceTable, {
	data: [],
	columns: [{
			type: "text"
		},
		{
			type: "text"
		},
		{
			type: "text"
		}
	],
	stretchH: "all",
	autoWrapRow: true,
	autoColumnSize: true, // カラム幅自動調整
	minSpareRows: 1, // 最低限表示する行数
	rowHeaders: true, // 行ヘッダ
	colHeaders: ["アドレス", "コメント", "値"], // 列ヘッダ
	colWidths: ["15%", "70%", "15%"], //列幅
	manualColumnResize: true, // 列幅変更可
	contextMenu: { // メニュー
		items: {
			undo: {
				name: "取り消す"
			},
			redo: {
				name: "やり直す"
			}
		}
	}
});

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ デバイス表切り出し
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function inputDispRange() {
	let dispStart = document.dispRange.dispStart.value;
	let dispEnd = document.dispRange.dispEnd.value;
	let regex = /^[wW][A-Fa-f0-9]{3}$/; // "W"+16進数3桁
	let startValue, endValue;
	let i, j, k, l;

	if (regex.test(dispStart) && regex.test(dispEnd)) {
		startValue = parseInt(dispStart.substr(1), 16);
		endValue = parseInt(dispEnd.substr(1), 16);

		dispData.length = 0;

		// データ切出し
		if (startValue <= endValue) { // k:開始 l:終了
			k = startValue;
			l = endValue;
		} else {
			k = endValue;
			l = startValue;
		}
		j = l - k + 1;
		for (i = 0; i < j; i++) {
			dispData[i] = new Array(3);
			dispData[i][0] = "W" + parseInt(k + i, 10).toString(16).toUpperCase();
			dispData[i][1] = commentList[k + i - SETTING_S][1];
			dispData[i][2] = dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][k + i] / commentList[k + i - SETTING_S][3] + " " + commentList[k + i - SETTING_S][4];
		}

		// データ読込
		deviceHOT.loadData(dispData);
	} else {
		alert("入力データが正しくありません。");
	}
}
