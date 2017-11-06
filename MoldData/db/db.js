// http://webos-goodies.jp/archives/50548720.html
// http://www.kogures.com/hitoshi/javascript/gaibu-file/index-ajax.html
// http://webos-goodies.jp/archives/50548720.html

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 製造No.に応じて設定ファイルを引っ張るテスト
/ 2017/11作成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
var xhr = new XMLHttpRequest();
var MachineList = new Array();

xhr.onreadystatechange = function() {
	if (xhr.readyState == 4 && xhr.status == 200) {
		var i, j, k, l;
		var result = xhr.responseText.split("\r\n");

		for (i = 0; i < result.length; i++) {
			MachineList[i] = result[i].split("\t");
		}
		xhr.abort(); // リクエストを中止
	}
}

xhr.open("GET", "./db/MachineList.txt", true); // ファイルを非同期通信でオープンする
xhr.send(null); // リクエストを発行
