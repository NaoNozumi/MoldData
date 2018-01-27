/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
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
	colHeaders: ["アドレス(EPC)", "アドレス(PLC)", "コメント", "値"], // 列ヘッダ
	colWidths: ["15%", "15%", "50%", "20%"], //列幅
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
function inputDispData() {
	let i, j, k, l;

	// コメント点数と型データ点数が一致しなければ処理はしない
	k = dataList.length;
	l = commentList.length;

	//	if (k === l) {
	// 初期化
	dispData.length = 0;

	// データ切出し
	j = dataList.length;
	for (i = 0; i < j; i++) {
		dispData[i] = new Array(4);
		(commentList[i] !== undefined) ? dispData[i][0] = commentList[i][0]: dispData[i][0] = "";
		(commentList[i] !== undefined) ? dispData[i][1] = commentList[i][1]: dispData[i][1] = "";
		(commentList[i] !== undefined) ? dispData[i][2] = commentList[i][2]: dispData[i][2] = "";
		dispData[i][3] = dataList[i];
	}

	// データ読込
	deviceHOT.loadData(dispData);
	/*	} else {
			alert("読出し不可 データ点数：" + k + "点 / コメント点数：" + l + "点");
		}*/
}
