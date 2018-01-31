/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/
/ 2018/01作成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
let i, j, k, l, m, n;
let rows, cells, th, td;

// おまけ
let tmp1 = document.getElementById("tmp1");
let tmp2 = document.getElementById("tmp2");
let tmp3 = document.getElementById("tmp3");

let deviceNum = document.getElementById("deviceNum");
let ch0num = document.getElementById("ch0num");

let moldDataList = document.getElementById("moldDataList");

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 覚書
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// 10ホルダ30型
const HOLDER_CNT = 10;
const FILE_CNT = 30;
const FILE_NAME_ITEM_NUM = 3; // 3項目

const CH0_ITEM_NUM = 4; // デバイス表に出す項目数 CW****/W****/コメント/値

let holderList = new Array(); // ホルダ配列
let fileList = new Array(); // ファイルリスト配列(30 or 300型)
let dataList = new Array(); // 型データ配列
let data2List = new Array(); // 2ワード型データ配列

let moldDataFlag = new Array(); // 型データ保存領域フラグ
let commentList = new Array(); // デバイスコメント配列

let csvTable = new Array(); // CSV出力用

let dispChangeButtons = document.getElementsByName("dispayChange"); // 表示切替釦
let flowDirectionChange = document.getElementsByName("flowDirectionChange"); // 流れ方向切替釦

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ http://www.sejuku.net/blog/32532
/ Form要素を取得する
/ イベントを設定
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
document.forms.gotForm.gotFile.addEventListener('change', fileRead, false); // *.DATファイル読み込み
let modelForm = document.forms.modelForm;
modelForm.addEventListener('click', modelFormClick, false); // 機種選択
j = dispChangeButtons.length;
for (i = 0; i < j; i++) {
	dispChangeButtons[i].addEventListener('click', showBlock, false); // 表示切替釦
}
flowDirectionChange[0].addEventListener('click', directChange, false); // 流れ方向切替

// 初期化
let model = "FLC";
let hoge = "";
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
			hoge = "";

			// 初期化
			holderList.length = 0;
			fileList.length = 0;
			dataList.length = 0;
			data2List.length = 0;

			moldDataFlag.length = 0;
			commentList.length = 0;

			csvTable.length = 0; // CSV出力用

			// 初期化
			upperRowNum.value = 9;
			upperColNum.value = 19;
			lowerRowNum.value = 9;
			lowerColNum.value = 19;
			FLOW_DIRECTION = true;

			// FLC点火率
			if (model === "FLCD") {
				RAITO_DOWN_S = 256;
			} else if (model === "FLTP") {
				RAITO_DOWN_S = 400;
			} else {
				RAITO_DOWN_S = 512;
			}
			upperChange();
			lowerChange();

			// CLS点火率
			clsHeaterRatio();
			// エアコック描画
			airCockDraw();

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
				case "FI":
					tmp = ch0Info.FI.moldDataRange;
					j = tmp.length;
					for (i = 0; i < j; i++) {
						moldDataFlag[i] = tmp[i];
					}
					loadCh0(ch0Info.FI.ch0); // *.ch0読込
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
				case "FLTP":
					tmp = ch0Info.FLTP.moldDataRange;
					j = tmp.length;
					for (i = 0; i < j; i++) {
						moldDataFlag[i] = tmp[i];
					}
					loadCh0(ch0Info.FLTP.ch0)
					break;
				case "OTHERS":
					// 表をクリア
					while (moldDataList.children[0].children[1]) moldDataList.children[0].removeChild(moldDataList.children[0].children[1]);
					break;
				default:
					break;
			}

			// デバイス表切り出し
			inputDispData();

			// 役に立たない型データ名
			tmp1.textContent = "ホルダ / 型";
			tmp2.textContent = "品名";
			tmp3.textContent = "作成者";

			// 型データ点数表示
			ch0num.textContent = "型データ点数 " + commentList.length + " 点";
			deviceNum.textContent = "一覧";
			break;

		default:
			break;
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ファイルが読み込まれた時の処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function fileRead(e) {
	// 読み込んだファイル情報を取得
	let moldFile = e.target.files[0];
	let fileName = moldFile.name.toUpperCase(); // 大文字に変換してから比較
	let regex = /^TYPE\d{1,2}.DAT$/; // TYPE**.DAT
	let result;

	// ファイル名チェック
	switch (true) {
		case regex.test(fileName): //
			result = fileName.match(/\d{1,2}/); // TYPE**.DATから数字部分を切出し
			if (1 <= result[0] && result[0] <= 30) {
				fileProcess(moldFile, "bin");
				hoge = fileName;
			} else {
				alert("サポート外のファイル形式です。");
			} // 1~30までか
			break;

		case fileName === "HNAME.DAT": //
			fileProcess(moldFile, "str");
			break;

		default:
			alert("サポート外のファイル形式です。");
			break;
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ データ処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function fileProcess(e, flag) {
	// FileReaderのインスタンスを作成
	let reader = new FileReader();

	if (flag === "bin") {
		reader.readAsArrayBuffer(e); // 読み込んだファイルの中身を取得
		reader.addEventListener('load', binaryLoad, false); // ファイルの中身取得後処理
	} else if (flag === "str") {
		reader.readAsText(e, 'shift_jis'); // 読み込んだファイルの中身を取得
		reader.addEventListener('load', fileLoad, false); // ファイルの中身取得後処理
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ファイルの中身取得後処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// 型データ
function binaryLoad(e) {
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
	dataList.length = 0;
	for (let i = 0; i < j; i++) {
		dataList[i] = I16A[i];
	}
	// 2Word
	/*j = I32A.length;
	data2List.length = 0;
	for (let i = 0; i < j; i++) {
		data2List[i] = I32A[i];
	}*/


	// 型データ点数表示
	deviceNum.textContent = "一覧 [型データ点数 " + dataList.length + "点]";

	// 機種毎に処理分岐
	switch (model) {
		case "FLC": // FLC点火率
			upperHeaterRatio();
			lowerHeaterRatio();
			moldDataName(1154, 0); // 型データ名
			break;
		case "FI": // FLC点火率
			upperHeaterRatio();
			lowerHeaterRatio();
			break;
		case "FLB": // FLC点火率
			upperHeaterRatio();
			lowerHeaterRatio();
			break;
		case "FLS": // FLC点火率
			upperHeaterRatio();
			lowerHeaterRatio();
			moldDataName(1154, 1); // 型データ名
			break;
		case "FLD": // FLC点火率
			upperHeaterRatio();
			lowerHeaterRatio();
			moldDataName(1164, 0); // 型データ名
			break;
		case "FLCD": // FLC点火率
			upperHeaterRatio();
			lowerHeaterRatio();
			break;
		case "FKS": // FLC点火率
			upperHeaterRatio();
			lowerHeaterRatio();
			break;
		case "CLS": // CLS点火率
			clsHeaterRatio();
			// エアコック描画
			airCockDraw();
			moldDataName(304, 1); // 型データ名
			break;
		case "FLTP": // FLC点火率
			upperHeaterRatio();
			lowerHeaterRatio();
			break;
		case "OTHERS": // FLC点火率
			upperHeaterRatio();
			lowerHeaterRatio();
			moldDataName(960, 1); // 型データ名
			break;
		default:
			break;
	}

	// デバイス表切り出し
	inputDispData();

	// デバイス表データ挿入
	// CSV出力用
	csvTable.length = 0;
	// ヘッダ情報
	csvTable[0] = new Array(CH0_ITEM_NUM);
	for (i = 0; i < CH0_ITEM_NUM; i++) {
		csvTable[0][i] = "\"" + moldDataList.children[0].children[0].children[i].textContent + "\"";
	}
	// デバイス表データ挿入
	j = moldDataList.children[0].children.length - 1;
	for (i = 0; i < j; i++) {
		for (o = 0; o < tentative; o++) {
			k = i + j * o;
			l = moldDataList.children[0].children[i + 1];
			(dataList[k] !== undefined) ? l.children[3 + CH0_ITEM_NUM * o].textContent = dataList[k]: l.children[3 + CH0_ITEM_NUM * o].textContent = "-";
			// CSV出力用
			csvTable[k + 1] = new Array(CH0_ITEM_NUM);
			for (m = 0; m < CH0_ITEM_NUM; m++) {
				n = l.children[m + CH0_ITEM_NUM * o].textContent;
				n = n.replace(/\"/g, "\"\"");
				csvTable[k + 1][m] = "\"" + n + "\"";
			}
		}
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 型リスト
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function fileLoad(e) {
	let i, j, k, l;
	// 改行で分解
	let rows = e.target.result.split("\r\n");

	// 品名/作成者/日付
	j = rows.length;
	fileList.length = 0;
	for (i = 0; i < j; i++) {
		fileList[i] = rows[i].split(",");
		l = fileList[i].length;
		for (k = 0; k < l; k++) {
			console.log(fileList[i][k]);
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
			commentList[o] = new Array(" ", " ", " ");
			commentList[o][0] = "CW" + ("0000" + (m + n)).slice(-4); // ゼロパディング(4桁)
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
	j = commentList.length;
	l = str.length;
	for (i = 0; i < j; i++) { // 全型データ保存領域
		for (m = 0; m < l; m++) { // *.ch0サーチ
			if (commentList[i][0] === str[m][0]) { // 一致した場合
				commentList[i][1] = str[m][2];
				commentList[i][2] = str[m][3].slice(2);
				break;
			}
		}
	}
	// デバイス表
	makeDeviceTable();
	ch0num.textContent = "型データ点数 " + commentList.length + " 点";
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// デバイス表
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
let tentative = 2; // 2分割(仮)

function makeDeviceTable() {
	let i, j, k, l, m, n, o, p;
	let rows, th, content;

	// 表をクリア
	while (moldDataList.children[0].children[1]) moldDataList.children[0].removeChild(moldDataList.children[0].children[1]);

	// 表生成
	j = Math.ceil(commentList.length / tentative);
	for (i = 0; i < j; i++) {
		// 行追加
		rows = moldDataList.insertRow(-1);
		for (k = 0; k < tentative; k++) {
			l = i + k * j;
			// No.セル追加
			(commentList[l] !== undefined) ? content = commentList[l][0]: content = "";
			rows.appendChild(document.createElement("th")).textContent = content;
			(commentList[l] !== undefined) ? content = commentList[l][1]: content = "";
			rows.appendChild(document.createElement("th")).textContent = content;

			// コメント/値セル追加
			th = rows.insertCell(-1);
			th.setAttribute("class", "comment");
			(commentList[l] !== undefined) ? th.textContent = commentList[l][2]: th.textContent = "";
			th = rows.insertCell(-1);
			th.setAttribute("class", "value");
			th.textContent = "-";
		}
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 型データ名
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// ホルダ/品名/作者名
function moldDataName(e, flag) {
	let i, j, k, l, m, n;
	let tmp, len;
	let no, loop, offset;

	// 型データ名フォーマット
	switch (flag) {
		case 0:
			len = 12;
			no = 1; // 型 No.
			loop = 1; // 品名のみ
			offset = 2; // 品名開始アドレスオフセット
			break;
		case 1:
			len = 32;
			no = 11; // 型 No.
			loop = 3; // ホルダ名/品名/作成者
			offset = 1; // 品名開始アドレスオフセット
			break;
		default:
			break;
	}

	// データ範囲確認
	if (dataList.length < (e + len)) {
		// データが取れない場合
		tmp1.textContent = "ホルダ / 型";
		tmp2.textContent = "品名";
		tmp3.textContent = "作成者";
	} else {
		tmp1.textContent = "ホルダ No." + dataList[e] + " / 型 No." + dataList[e + no] + " / ホルダ名：";
		i = e + offset;
		m = i;

		// ホルダ名/品名/作成者
		for (l = 0; l < loop; l++) {
			tmp = ""; // 初期化
			for (j = 0; j < 10; j++) {
				k = toHex(dataList[i].toString(10), 0);
				if (k === "0000") break; // "0000"は何も入力されていないと見做す
				tmp += k; // 文字列連結
				i++;
			}
			// アドレス+10点
			switch (l) {
				case (0):
					i = m + 11;
					break;
				case (1):
					i = m + 21;
					break;
				default:
					break;
			}
			(flag === 1) ? txtDecode(tmp, l): txtDecode(tmp, 1);
		}
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 表示/非表示切替
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function showBlock(e) {
	let i = e.target.id.slice(0, -6);
	let j = document.getElementById(i).style.display;

	(j == "" || j == "block") ? document.getElementById(i).style.display = "none": document.getElementById(i).style.display = "block";
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 流れ方向切替
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function directChange(e) {
	// 設定反転
	FLOW_DIRECTION = !FLOW_DIRECTION;

	// 表をクリア
	while (ratioUp.children[0].children[0]) ratioUp.children[0].removeChild(ratioUp.children[0].children[0]);
	while (ratioCorner.children[0].children[0]) ratioCorner.children[0].removeChild(ratioCorner.children[0].children[0]);
	while (ratioDown.children[0].children[0]) ratioDown.children[0].removeChild(ratioDown.children[0].children[0]);

	// 点火率画面生成
	makeUpperHeaterHeader();
	makeUpperRatioTable();
	makeLowerHeaterHeader();
	makeLowerRatioTable();

	// FLC点火率
	if (model !== "CLS") {
		upperHeaterRatio();
		lowerHeaterRatio();
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 文字コード変換の為のあれこれ
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function toHex(e, f) {
	let i, j, k;

	// 負の数だった場合
	if (e.indexOf("-") != -1) {
		e = e.slice(1); // 符号を除く
		e = binNumberConv(e); // 2進数変換
		e = complement(e); // 2の補数
	} else {
		e = binNumberConv(e); // 2進数変換
	}

	// 16進数変換
	k = parseInt(e, 2).toString(16);
	// 桁合わせ
	j = 4 - k.length;
	for (i = 0; i < j; i++) {
		k = "0" + k;
	}

	// swap
	// リトルエンディアンと判断されたものに対して処理
	if (f == 0) {
		let LE, BE;
		LE = k.substr(2, 2);
		BE = k.substr(0, 2);
		k = LE + BE;
	}

	return k;
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 2進数
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function binNumberConv(e) {
	let i, j, k;

	// 2進数変換
	e = parseInt(e, 10).toString(2);
	// 16桁合わせ
	j = 16 - e.length;
	for (i = 0; i < j; i++) {
		e = "0" + e;
	}

	return e;
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 2の補数
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function complement(e) {
	let i, j, k;

	// ビット反転&1加算(2の補数)
	//i = (0b1111111111111111 ^ ("0b" + i)) + 0b1; // 残念、ieで動かない
	let a, tmp;
	tmp = "";
	for (k = 0; k < 16; k++) {
		a = e.substr(k, 1); // 1文字切出し
		switch (a) {
			case "0":
				a = "1";
				break;
			case "1":
				a = "0";
				break;
			default:
				break;
		}
		tmp += a;
	}
	tmp = parseInt(tmp, 2) + 1; // 1加算

	// 2進数
	i = tmp.toString(2);

	return i;
}
