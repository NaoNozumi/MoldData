/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/
/ 2018/02作成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// 10ホルダ30型
const HOLDER_CNT = 10;
const FILE_CNT = 30;
// デバイスCW/W/コメントで+3
const TITLE_CNT = 3;

let dataList = new Array(); // 型データ配列
let data2List = new Array(); // 2ワード型データ配列
let moldDataFlag = new Array(); // 型データ保存領域フラグ

let ch0num = document.getElementById("ch0num");

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ http://www.sejuku.net/blog/32532
/ Form要素を取得する
/ イベントを設定
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
document.forms.gotForm.gotFile.addEventListener('change', fileRead, false); // *.DATファイル読み込み
let modelForm = document.forms.modelForm;
modelForm.addEventListener('click', modelFormClick, false); // 機種選択

// Initial
let model = "FLC";
modelForm.model[0].checked = true;

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 機種選択
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function modelFormClick(e) {
	let tmp, i, j;

	switch (e.target.type) {
		case "radio": // 機種
			// 機種名取得
			model = e.target.value;

			// 初期化
			dataList.length = 0;
			data2List.length = 0;

			moldDataFlag.length = 0;

			// 機種毎の処理
			// http://39mamon.com/?p=156
			// javascriptでは連想配列を別の要素に代入すると参照渡しになるらしい。
			switch (model) {
				case "FLC":
					tmp = ch0Info.FLC.moldDataRange;
					j = tmp.length;
					for (i = 0; i < j; i++) {
						moldDataFlag[i] = tmp[i];
					}
					loadCh0(ch0Info.FLC.ch0); // *.ch0読込
					break;
				case "FLB":
					tmp = ch0Info.FLB.moldDataRange;
					j = tmp.length;
					for (i = 0; i < j; i++) {
						moldDataFlag[i] = tmp[i];
					}
					loadCh0(ch0Info.FLB.ch0); // *.ch0読込
					break;
				case "FLS":
					tmp = ch0Info.FLS.moldDataRange;
					j = tmp.length;
					for (i = 0; i < j; i++) {
						moldDataFlag[i] = tmp[i];
					}
					loadCh0(ch0Info.FLS.ch0); // *.ch0読込
					break;
				case "FLD":
					tmp = ch0Info.FLD.moldDataRange;
					j = tmp.length;
					for (i = 0; i < j; i++) {
						moldDataFlag[i] = tmp[i];
					}
					loadCh0(ch0Info.FLD.ch0); // *.ch0読込
					break;
				case "FLCD":
					tmp = ch0Info.FLCD.moldDataRange;
					j = tmp.length;
					for (i = 0; i < j; i++) {
						moldDataFlag[i] = tmp[i];
					}
					loadCh0(ch0Info.FLCD.ch0); // *.ch0読込
					break;
				case "FKS":
					tmp = ch0Info.FKS.moldDataRange;
					j = tmp.length;
					for (i = 0; i < j; i++) {
						moldDataFlag[i] = tmp[i];
					}
					loadCh0(ch0Info.FKS.ch0); // *.ch0読込
					break;
				case "CLS":
					tmp = ch0Info.CLS.moldDataRange;
					j = tmp.length;
					for (i = 0; i < j; i++) {
						moldDataFlag[i] = tmp[i];
					}
					loadCh0(ch0Info.CLS.ch0); // *.ch0読込
					break;
				default:
					break;
			}
			// 型データ点数表示
			ch0num.textContent = "型データ点数 " + dataList.length + " 点";
			break;
		default:
			break;
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ファイルが読み込まれた時の処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function fileRead(e) {
	// 配列初期化
	//dataList.length = 0;

	// 読み込んだファイル情報を取得
	let moldFile = e.target.files;
	let regex = /^TYPE\d{1,2}.DAT$/; // TYPE**.DAT
	let fileName, result, i, j;

	// 各ファイルに付いて処理
	j = moldFile.length;
	for (i = 0; i < j; i++) {
		fileName = moldFile[i].name.toUpperCase(); // 大文字に変換してから比較

		// ファイル名チェック
		if (regex.test(fileName)) {
			result = fileName.match(/\d{1,2}/); // TYPE**.DATから数字部分を切出し
			if (1 <= result[0] && result[0] <= 30) {
				fileProcess(moldFile[i], result[0]);
			} else {
				// 未処理
			}
		}
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ データ処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function fileProcess(e, num) {
	// 配列初期化
	//dataList[num - 1 + TITLE_CNT] = []; // デバイスCW/W/コメントで+3

	// FileReaderのインスタンスを作成
	let reader = new FileReader();

	reader.readAsArrayBuffer(e); // 読み込んだファイルの中身を取得
	// コールバック関数にあらかじめ引数を渡す
	// https://qiita.com/Lewuathe/items/5827a9b429aa71c4f76e
	reader.addEventListener('load', binaryLoad(num), true); // ファイルの中身取得後処理
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ファイルの中身取得後処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// 型データ
function binaryLoad(num) {
	return function(e) {
		let i, j, k, l, m, n, o, p;

		// ArrayBuffer取得
		i = e.target.result;
		// 16ビット符号付き整数値
		let I16A = new Int16Array(i);
		// 32ビット符号付き整数値
		/*j = i.byteLength;
		if (j % 4 === 0) {
			I32A = new Int32Array(i);
		} else {
			k = j / 4 | 0;
			I32A = new Int32Array(i, 0, k);
		}*/

		// 型データ
		// 1Word
		j = I16A.length;
		for (i = 0; i < j; i++) {
			dataList[i][num - 1 + TITLE_CNT] = I16A[i]; // デバイスCW/W/コメントで+3
		}
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ コメントリスト
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function makech0List(e) {
	let i, j, k, l, m, n, o, p;
	let str = new Array();

	// 型データ保存点数演算
	j = moldDataFlag.length;
	o = 0;
	for (i = 0; i < j; i++) {
		// @位置
		k = moldDataFlag[i].indexOf("@");
		// コメントリスト生成
		l = parseInt(moldDataFlag[i].slice(k + 1), 10); // 点数
		m = parseInt(moldDataFlag[i].substring(2, k), 10); // 開始アドレス
		//
		for (n = 0; n < l; n++) {
			dataList[o] = Array(FILE_CNT + TITLE_CNT);
			// 配列初期化
			for (let q = 0, r = FILE_CNT + TITLE_CNT; q < r; q++) {
				if (0 <= q && q < TITLE_CNT) {
					dataList[o][q] = ""
				} else if (TITLE_CNT <= q) {
					dataList[o][q] = 0;
				}
			}
			dataList[o][0] = "CW" + ("0000" + (m + n)).slice(-4); // ゼロパディング(4桁)
			o++;
		}
	}

	// コメント切出
	j = e.length;
	for (i = 0; i < j; i++) {
		// データ分割
		str[i] = e[i].split(",");
	}

	// 型データ保存領域コメント抽出
	j = dataList.length;
	l = str.length;
	for (i = 0; i < j; i++) { // 全型データ保存領域
		for (m = 0; m < l; m++) { // *.ch0サーチ
			if (dataList[i][0] === str[m][0]) { // 一致した場合
				dataList[i][1] = str[m][2];
				dataList[i][2] = str[m][3].slice(2);
				break;
			}
		}
	}
	// デバイス表
	ch0num.textContent = "型データ点数 " + dataList.length + " 点";
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
	let name = model + "_deviceList.csv";

	// 入力内容取得
	let content = dataList;
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
