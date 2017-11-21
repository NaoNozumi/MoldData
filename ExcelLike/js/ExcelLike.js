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
	autoColumnSize: true, // カラム幅自動調整
	minSpareRows: 1, // 最低限表示する行数
	rowHeaders: true, // 行ヘッダ
	colHeaders: ["アドレス", "コメント", "備考", "桁", "単位"], // 列ヘッダ
	colWidths: [80, 240, 160, 80, 80], //列幅
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
