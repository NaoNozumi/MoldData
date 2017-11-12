/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ http://webos-goodies.jp/archives/50548720.html
/ http://www.kogures.com/hitoshi/javascript/gaibu-file/index-ajax.html
/ http://webos-goodies.jp/archives/50548720.html
/
/ 初期化
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
let machineName = document.getElementById("machineName");
let loadCount;

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
// https://so-zou.jp/web-app/tech/programming/javascript/sample/script.htm
// https://qiita.com/w650/items/adb108649a0e2a86f334
function inputSerial() {
	let i, j, k, l;
	let value = document.serialForm.serialNum.value;
	let regex = /^\d{4}$/; // 半角4桁の数字

	// 入力データが正しければ、検索
	if (regex.test(value)) {
		j = 0; // 検索完了フラグ
		for (i = 0; i < MachineList.length; i++) {
			if (MachineList[i][1] == value) {
				j = 1; // 一致フラグ
				machineName.textContent = MachineList[i][0] + " #" + value + " " + MachineList[i][3] + " " + MachineList[i][2];
				// https://q-az.net/remove-native-javascript/
				if (document.getElementsByTagName("script").length > 8) {
					// init.jsとratioArray.js再読込
					let elem1 = document.getElementsByTagName("script")[8];
					let elem2 = document.getElementsByTagName("script")[9];

					elem1.parentNode.removeChild(elem1);
					elem2.parentNode.removeChild(elem2);
				}
				// スクリプト読込
				loadCount = 0;
				loadScript(value);
				break;
			}
		}
		if (j == 0) machineName.textContent = "該当なし";
	} else {
		alert("入力データが正しくありません。");
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 動的にjsを実行する
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
let scripts = new Array("/init.js", "/ratioArray.js");
let len = scripts.length;

function loadScript(e) {
	let i, j;
	let ga = document.createElement("script");

	ga.charset = "UTF-8";
	ga.src = "./HDATA/" + e + scripts[loadCount];
	ga.defer = "defer";
	document.body.appendChild(ga);
	loadCount++;

	if (loadCount < len) ga.onload = loadScript(e);
	// 最後に点火率画面再描画
	if (loadCount == len) {
		ga.onload = function() {
			// 点火率再描画
			j = ratioUp.rows.length;
			for (i = 0; i < j; i++) {
				ratioUp.deleteRow(0);
			}
			j = ratioCorner.rows.length;
			for (i = 0; i < j; i++) {
				ratioCorner.deleteRow(0);
			}
			j = ratioDown.rows.length;
			for (i = 0; i < j; i++) {
				ratioDown.deleteRow(0);
			}

			makeRatioTable();
		}
	}
}
