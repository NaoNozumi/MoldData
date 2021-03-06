/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ comment.txt編集テスト
/ Handsontable
/ https://qiita.com/opengl-8080?page=3
/ 2017/11作成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
let commData = new Array();
let commTable = document.getElementById("commentTable"); // テーブル
let hot = new Handsontable(commTable, {
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
			type: "numeric"
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
	colHeaders: ["アドレス", "コメント", "備考", "桁", "単位"], // 列ヘッダ
	colWidths: ["12%", "40%", "24%", "12%", "12%"], //列幅
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
document.forms.getForm.getFile.addEventListener('change', commRead, false); // *.TXTファイル読み込み

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ファイルが読み込まれた時の処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function commRead(e) {
	// 読み込んだファイル情報を取得
	let commFile = e.target.files[0];

	switch (commFile.name) {
		case "comment.txt": // コメントファイル
			let reader = new FileReader(); // FileReaderのインスタンスを作成

			reader.readAsText(commFile); // 読み込んだファイルの中身を取得
			reader.addEventListener('load', commLoad, false); // ファイルの中身取得後処理
			break;

		default:
			alert("サポート外のファイル形式です。");
			break;
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ファイルの中身取得後処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function commLoad(e) {
	// 改行で分解
	let rows = e.target.result.split("\r\n");
	let i, j;

	commData.length = 0;

	for (i = 0; i < rows.length; i++) {
		// データ分割
		commData[i] = rows[i].split("\t");
	}

	// データ読込
	hot.loadData(commData);
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ comment.txt書出
/ https://gist.github.com/mojagehub/75aa23f42a211a5d722ace35fda50a7c
/ https://stackoverflow.com/questions/29677339/invalidstateerror-in-internet-explorer-11-during-blob-creation
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function dataDownload() {
	let i, j, k, l;
	let bb, blob;
	let strRow = new Array(); // 行
	let strData;

	// 入力内容取得
	let content = hot.getData();
	// タブ区切り
	k = content.length;
	for (i = 0; i < k; i++) {
		strRow[i] = content[i].join("\t");
	}
	// 改行挿入
	strData = strRow.join("\r\n");

	// comment.txtダウンロード処理
	try {
		// Blob形式に変換
		blob = new Blob([strData], {
			"type": "text/plain"
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
			blob = bb.getBlob("text/plain");
		}
	} finally {
		// for MS IE
		if (window.navigator.msSaveBlob) {
			window.navigator.msSaveBlob(blob, "comment.txt");
		} else {
			let blobURL = window.URL.createObjectURL(blob); // URL発行
			let a = document.createElement("a"); // URLをaタグに設定
			a.href = blobURL;
			a.download = "comment.txt"; // download属性でファイル名指定
			document.body.appendChild(a); // DOMにaタグ追加
			a.click(); // Clickしてダウンロード
			a.parentNode.removeChild(a); // 終了したら片付け
		}
	}
}
