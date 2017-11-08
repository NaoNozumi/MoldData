/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ http://webos-goodies.jp/archives/50548720.html
/ http://www.kogures.com/hitoshi/javascript/gaibu-file/index-ajax.html
/ http://webos-goodies.jp/archives/50548720.html
/
/ 初期化
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
let machineName = document.getElementById("machineName");

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 製造No.に応じて設定ファイルを引っ張るテスト
/ 2017/11作成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
let xhr = new XMLHttpRequest();
let MachineList = new Array();

// 製造No.リスト読込
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4 && xhr.status == 200) {
		let i, j, k, l;
		let result = xhr.responseText.split("\r\n");

		for (i = 0; i < result.length; i++) {
			MachineList[i] = result[i].split("\t");
		}
		xhr.abort(); // リクエストを中止
	}
}

xhr.open("GET", "./db/MachineList.txt", true); // ファイルを非同期通信でオープンする
xhr.send(null); // リクエストを発行

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 機械リストから入力データに従ってデータを拾う
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function inputSerial() {
	let i, j, k, l;
	let value = document.serialForm.serialNum.value;
	let regex = /^\d{4}$/; // 半角4桁の数字

	// 入力データが正しければ、検索
	if (regex.test(value)) {
		j = 0; // 検索完了フラグ
		for (i = 0; i < MachineList.length; i++) {
			if (MachineList[i][1] == value) {
				j = 1;
				machineName.textContent = MachineList[i][0] + " #" + value + " " + MachineList[i][3] + " " + MachineList[i][2];
				break;
			}
		}
		if (j == 0) machineName.textContent = "該当なし";
	} else {
		alert("入力データが正しくありません。");
	}
}
