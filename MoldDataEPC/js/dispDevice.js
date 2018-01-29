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

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ デバイスデータ書出
/ https://gist.github.com/mojagehub/75aa23f42a211a5d722ace35fda50a7c
/ https://stackoverflow.com/questions/29677339/invalidstateerror-in-internet-explorer-11-during-blob-creation
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function dataDownload() {
	let i, j, k, l;
	let bb, blob;
	let strRow = new Array(); // 行
	let strData;
	let name = model + "_" + hoge.replace(".DAT","") + "_deviceList.csv";

	// 入力内容取得
	let content = csvTable;
	// タブ区切り
	k = content.length;
	for (i = 0; i < k; i++) {
		strRow[i] = content[i].join(",");
	}
	// 改行挿入
	strData = strRow.join("\r\n");

	// ダウンロード処理
	try {
		// Blob形式に変換
		blob = new Blob([strData], {
			"type": "text/csv"
		});
	} catch (e) {
		// for MS IE
		window.BlobBuilder = window.BlobBuilder ||
			window.WebKitBlobBuilder ||
			window.MozBlobBuilder ||
			window.MSBlobBuilder;

		if (window.BlobBuilder) {
			bb = new BlobBuilder();
			bb.append(content);
			blob = bb.getBlob("text/csv");
		}
	} finally {
		// for MS IE
		if (window.navigator.msSaveBlob) {
			window.navigator.msSaveBlob(blob, name);
		} else {
			let blobURL = window.URL.createObjectURL(blob); // URL発行
			let a = document.createElement("a"); // URLをaタグに設定
			a.href = blobURL;
			a.download = name; // download属性でファイル名指定
			document.body.appendChild(a); // DOMにaタグ追加
			a.click(); // Clickしてダウンロード
			a.parentNode.removeChild(a); // 終了したら片付け
		}
	}
}
