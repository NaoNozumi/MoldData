/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/
/ 2018/02作成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */


/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ http://www.sejuku.net/blog/32532
/ Form要素を取得する
/ イベントを設定
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
document.forms.gotForm.gotFile.addEventListener('change', fileRead, false); // *.DATファイル読み込み

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ファイルが読み込まれた時の処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function fileRead(e) {
	// 読み込んだファイル情報を取得
	let moldFile = e.target.files;
	console.log(moldFile);
	let fileName = moldFile.name.toUpperCase(); // 大文字に変換してから比較
	let regex = /^TYPE\d{1,2}.DAT$/; // TYPE**.DAT
	let result;

	// ファイル名チェック
	if (regex.test(fileName)) result = fileName.match(/\d{1,2}/); // TYPE**.DATから数字部分を切出し
	if (1 <= result[0] && result[0] <= 30) {
		fileProcess(moldFile, "bin");
	} else {
		alert("サポート外のファイル形式です。");
	} // 1~30までか
}
