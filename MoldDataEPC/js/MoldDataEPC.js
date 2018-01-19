/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/
/ 2018/01作成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
let i, j, k, l, m, n;
let rows, cells, th, td;

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 覚書
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// 10ホルダ30型
const HOLDER_CNT = 10;
const FILE_CNT = 30;
const FILE_NAME_ITEM_NUM = 3; // 3項目

let holderList = new Array(); // ホルダ配列
let fileList = new Array(); // ファイルリスト配列(30 or 300型)
let dataList = new Array(); // 型データ配列

let moldDataFlag = new Array(); // 型データ保存領域フラグ
let commentList = new Array(); // デバイスコメント配列

let dispChangeButtons = document.getElementsByName("dispayChange"); // 表示切替釦

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

// 初期化
let model = "FLC";
modelForm.model[0].checked = true;
moldDataFlag = ["CW0@1024", "CW1120@170"];

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 機種選択
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function modelFormClick(e) {
	switch (e.target.type) {
		case "radio": // 機種
			// 機種名取得
			model = e.target.value;

			// 初期化
			holderList.length = 0;
			fileList.length = 0;
			dataList.length = 0;

			moldDataFlag.length = 0;
			commentList.length = 0;

			// FLC点火率
			upperHeaterRatio();
			lowerHeaterRatio();

			// CLS点火率
			clsHeaterRatio();
			// エアコック描画
			airCockDraw();

			// 機種毎の処理
			switch (model) {
				case "FLC":
					moldDataFlag = ["CW0@1024", "CW1120@170"];
					loadCh0("Flc001o.ch0"); // *.ch0読込
					break;
				case "FLD":
					moldDataFlag = ["CW0@512", "CW512@245"];
					loadCh0("Fld001e.ch0"); // *.ch0読込
					break;
				case "FLCD":
					moldDataFlag = ["CW0@512", "CW512@245"];
					loadCh0("Fcd001c.ch0"); // *.ch0読込
					break;
				case "FKS":
					moldDataFlag = ["CW0@608", "CW1100@100"];
					loadCh0("Fks001b.ch0"); // *.ch0読込
					break;
				case "CLS":
					moldDataFlag = ["CW0@350"];
					loadCh0("Cls001j.ch0"); // *.ch0読込
					break;
				case "FLTP":
					moldDataFlag = ["CW0@760", "CW1070@170"];
					break;
				case "OTHERS":
					break;
				default:
					break;
			}

			// デバイス表切り出し
			inputDispData();
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
			(1 <= result[0] && result[0] <= 30) ? fileProcess(moldFile, "bin"): alert("サポート外のファイル形式です。"); // 1~30までか
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
		reader.readAsText(e); // 読み込んだファイルの中身を取得
		reader.addEventListener('load', fileLoad, false); // ファイルの中身取得後処理
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ファイルの中身取得後処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// 型データ
function binaryLoad(e) {
	// 16ビット符号付き整数値
	let I16A = new Int16Array(e.target.result);

	// 型データ
	j = I16A.length;
	dataList.length = 0;
	for (let i = 0; i < j; i++) {
		dataList[i] = I16A[i];
	}

	// 機種毎に処理分岐
	switch (model) {
		case "FLC": // FLC点火率
			upperHeaterRatio();
			lowerHeaterRatio();
			break;
		case "FLD": // FLC点火率
			upperHeaterRatio();
			lowerHeaterRatio();
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
			break;
		case "FLTP":
			break;
		case "OTHERS":
			break;
		default:
			break;
	}

	// デバイス表切り出し
	inputDispData();
}

/*
// 型リスト
*/
function fileLoad(e) {
	// 改行で分解
	let rows = e.target.result.split("\r\n");
	let i, j;

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

/*
// コメントリスト
*/
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
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 表示/非表示切替
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function showBlock(e) {
	let i = e.target.id.slice(0, -6);
	let j = document.getElementById(i).style.display;

	(j == "" || j == "block") ? document.getElementById(i).style.display = "none": document.getElementById(i).style.display = "block";
}
