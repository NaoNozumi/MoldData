/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ comment.txt編集テスト
/ 2017/11作成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
let data = new Array();
let commentTable = document.getElementById("commentTable"); // テーブル
let hot = new Handsontable(commentTable);
document.forms.getForm.getFile.addEventListener('change', fileRead, false); // *.TXTファイル読み込み

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ファイルが読み込まれた時の処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function fileRead(e) {
	// 読み込んだファイル情報を取得
	let commentFile = e.target.files[0];

	switch (commentFile.name) {
		case "comment.txt": // コメントファイル
			let reader = new FileReader(); // FileReaderのインスタンスを作成

			reader.readAsText(commentFile); // 読み込んだファイルの中身を取得
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
	let i;

	for (i = 0; i < rows.length; i++) {
		// データ分割
		data[i] = rows[i].split("\t");
	}

	new Handsontable(commentTable, {
		data: data,
		rowHeaders: true,
		colHeaders: true
	});
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
