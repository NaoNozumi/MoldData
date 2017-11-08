/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 覚書
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
/*
1) レシピファイルの改行コードは"\r\n"
2) comment.txtはW400~W5FFまでのアドレスとコメントが記入されている。
  各項目間はタブ区切りで改行コードは"\r\n"
*/

// レシピファイル情報
// 行は「1」始まりとしてカウントします。
const RECIPE_NAME = 2; // レシピファイル名(:RECIPE_NAME)存在行 - 1
const HOLDER_NAME_S = 12; // ホルダ名開始行 - 1
const HOLDER_NAME_E = 32; // ホルダ名終了行
const FILE_NAME_S = 32; // ファイル名開始行 - 1
const FILE_NAME_E = 932; // ファイル名終了行
const KATA_S = 12; // 型データ開始行 - 1
const KATA_E = 2060; // 型データ終了行
// 列は「0」始まりとしてカウントします。
const DATA_S = 5; // データ開始列

// 型データ構成
// "_S"は開始アドレス
// 「0」始まりとします。(W0~2048点)
const RATIO_UP_S = 0; // 上ヒータ点火率開始アドレス
const RATIO_UP_NUM = 512; // 上ヒータ点火率点数
const RAITO_DOWN_S = 512; // 下ヒータ点火率開始アドレス
const RATIO_DOWN_NUM = 512; // 下ヒータ点火率点数
const CLS_PEHEATING_S = 1088; // CLSヒータ予熱温度開始アドレス
const CLS_OPERATION_S = 1120; // CLSヒータ運転温度開始アドレス
const SETTING_S = 1024; // 他設定開始アドレス
const SETTING_NUM = 512; // 他設定点数
const FUNCTION_S = 1152; // 機能開始アドレス
const FUNCTION_NUM = 48; // 機能点数(何とFLCは80点)
const TIMING_S = 1216; // タイミング開始アドレス
const TIMING_NUM = 64; //タイミング点数
const COMMENT_NUM = SETTING_NUM; // 他設定コメント点数
const MEMO_S = 1536; // メモ画面(文字入力)開始アドレス
const MEMO_NUM = 512; // メモ画面(文字入力)点数
const MEMO01_S = 1536; // メモ01開始アドレス
const MEMO02_S = 1792; // メモ02開始アドレス

// 10ホルダ30型
const HOLDER_CNT = 10;
const FILE_CNT = 30;
// ファイル頁3
const PAGE_CNT = 3;
const HOLDER_NAME_LENGTH = 20; // ホルダ名20ワード
const FILE_NAME_LENGTH = 30; // ファイル名10ワード x 3項目
const FILE_NAME_ITEM_NUM = 3; // 3項目

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 型データ読み込み・表示
/ 2017/10作成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
let i, j, k, l, m, n;
let rows, cells, th, td;

let holderList = new Array(HOLDER_CNT); // ホルダ配列
let fileHolder = new Array(HOLDER_CNT); // ファイルリスト配列(10ホルダ900点)
let fileList = new Array(HOLDER_CNT * FILE_CNT); // ファイルリスト配列(300型)
let dataList = new Array(HOLDER_CNT * FILE_CNT); // 型データ配列
let commentList = new Array(COMMENT_NUM); // デバイスコメント配列

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ http://www.sejuku.net/blog/32532
/ Form要素を取得する
/ イベントを設定
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
document.forms.gotForm.gotFile.addEventListener('change', fileRead, false); // *.TXTファイル読み込み
document.forms.listForm.addEventListener('click', listFormClick, false);

let moldList = document.getElementById("moldList");
let moldDataList = document.getElementById("moldDataList");
let functionList = document.getElementById("functionList");
let listForm = document.forms.listForm;
let dataName = document.getElementById("dataName"); // 型データ名

// 初期化
let holderNum = 0;
let pageNum = 0;
let fileNum = 0;
listForm.filePage[0].checked = true;

/* 長さNの配列をSで埋めて作成したい。
let a = (new Array(3)).fill('A'); // ["A", "A", "A"]

length N の配列の作成は new Array(N)
arr.fill()メソッドは第一引数で指定された値で配列の値を設定する。

arr.fill(value[, start = 0[, end = this.length]])

value 配列に設定する値。
start オプション。開始位置。
end オプション。終了位置。
出典: Array.prototype.fill() - JavaScript | MDN */
for (i = 0; i < holderList.length; i++) { // ホルダ2次元配列宣言
	//holderList[i] = (new Array(HOLDER_NAME_LENGTH)).fill("");// ie動かない
	holderList[i] = new Array(HOLDER_NAME_LENGTH);
	for (j = 0; j < HOLDER_NAME_LENGTH; j++) {
		holderList[i][j] = "";
	}
}
for (i = 0; i < fileHolder.length; i++) { // ファイルリスト(10ホルダ900点)2次元配列宣言
	fileHolder[i] = new Array(FILE_NAME_E - FILE_NAME_S);
}
for (i = 0; i < fileList.length; i++) { // ファイル毎(300型)2次元配列宣言
	//fileList[i] = (new Array(FILE_NAME_LENGTH)).fill("");
	fileList[i] = new Array(FILE_NAME_LENGTH);
	for (j = 0; j < FILE_NAME_LENGTH; j++) {
		fileList[i][j] = "";
	}
}
for (i = 0; i < dataList.length; i++) { // 型データ毎2次元配列宣言
	//dataList[i] = (new Array(KATA_E - KATA_S)).fill("");
	dataList[i] = new Array(KATA_E - KATA_S);
	for (j = 0; j < (KATA_E - KATA_S); j++) {
		dataList[i][j] = "";
	}
}
for (i = 0; i < COMMENT_NUM; i++) {
	commentList[i] = "";
}
/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ファイルリスト選択
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// ホルダと頁
function listFormClick(e) {
	switch (e.target.type) {
		case "radio": // ファイル頁
			if (e.target.value === "filePage01") {
				pageNum = 0;
				fileNum = 0;
			} else if (e.target.value === "filePage02") {
				pageNum = 1;
				fileNum = 0;
			} else if (e.target.value === "filePage03") {
				pageNum = 2;
				fileNum = 0;
			}
			// 型リスト生成
			makeFileList();
			// 型データリスト生成
			makeDataList();
			break;
		case "button": // ホルダNo.
			if (e.target.value === "Up") {
				if (holderNum < (HOLDER_CNT - 1)) {
					holderNum++;
					pageNum = 0;
					fileNum = 0;
					listForm.filePage[0].checked = true;
				}
			} else if (e.target.value === "Down") {
				if (holderNum > 0) {
					holderNum--;
					pageNum = 0;
					fileNum = 0;
					listForm.filePage[0].checked = true;
				}
			}
			// 型リスト生成
			makeFileList();
			// 型データリスト生成
			makeDataList();
			break;
		default:
			break;
	}
}

// ファイル
function fileSelect(e) {
	let i, j, k, l;

	// setattributesで追加される属性の順番は決まらない
	j = e.target.attributes.length;
	for (i = 0; i < j; i++) {
		k = e.target.attributes[i].value;
		if (k.indexOf("fileNum") != -1) fileNum = parseInt(k.replace("fileNum", ""));
	}

	// 型データ名
	dataName.textContent = "ホルダNo. " + (holderNum + 1) + " / " + "ファイルNo. " + (pageNum * (FILE_CNT / PAGE_CNT) + fileNum + 1) + " / " + moldList.rows[fileNum + 1].cells[1].textContent;

	// 型データリスト生成
	makeDataList();
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 型リスト生成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
for (i = 0; i < (FILE_CNT / PAGE_CNT); i++) {
	// http://javascript123.seesaa.net/article/390980127.html
	// 行追加
	rows = moldList.insertRow(-1);
	// No.セル追加
	th = rows.appendChild(document.createElement("th"));
	th.textContent = (FILE_CNT / PAGE_CNT) * pageNum + i + 1;
	th.setAttribute("name", "num");
	th.setAttribute("value", "fileNum" + i);
	//
	th.addEventListener('click', fileSelect, false);

	// 品名/作者/日付セル追加
	for (j = 0; j < FILE_NAME_ITEM_NUM; j++) {
		rows.insertCell(-1).textContent = "-";
	}
}

// デバイス表
let tentative = 4; // 4分割(仮)
for (i = 0; i < (SETTING_NUM / tentative); i++) {
	// http://javascript123.seesaa.net/article/390980127.html
	// 行追加
	rows = moldDataList.insertRow(-1);
	for (j = 0; j < tentative; j++) {
		// No.セル追加
		k = SETTING_S + (SETTING_NUM / tentative) * j + i;
		rows.appendChild(document.createElement("th")).textContent = "W" + parseInt(k, 10).toString(16).toUpperCase();

		// コメント/値セル追加
		th = rows.insertCell(-1);
		th.setAttribute("class", "comment");
		th.textContent = "-";
		th = rows.insertCell(-1);
		th.setAttribute("class", "value");
		th.textContent = "-";
	}
}

// 機能一覧
for (i = 0; i < (FUNCTION_NUM / tentative); i++) {
	// 行追加
	rows = functionList.insertRow(-1);

	for (j = 0; j < tentative; j++) {
		td = rows.insertCell(-1);
		td.setAttribute("class", "functionComment");
		td.textContent = "機能" + ((FUNCTION_NUM / tentative) * j + i + 1);
		td = rows.insertCell(-1);
		td.setAttribute("class", "functionValue a");
		td.textContent = "";
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ファイルが読み込まれた時の処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function fileRead(e) {
	// 読み込んだファイル情報を取得
	let moldFile = e.target.files[0];

	switch (moldFile.name) {
		case "KATA.TXT": // 型データ
			// 初期化
			holderNum = 0;
			pageNum = 0;
			fileNum = 0;
			listForm.filePage[0].checked = true;

			fileProcess(moldFile);
			break;

		case "NAME.TXT": // 型リスト
			// 初期化
			holderNum = 0;
			pageNum = 0;
			fileNum = 0;
			listForm.filePage[0].checked = true;

			fileProcess(moldFile);
			break;

		case "comment.txt": // コメントファイル
			fileProcess(moldFile);
			break;

		default:
			console.log("サポート外のファイル形式です。");
			break;
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ データ処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function fileProcess(e) {
	// FileReaderのインスタンスを作成
	let reader = new FileReader();

	// 読み込んだファイルの中身を取得
	reader.readAsText(e);

	// ファイルの中身取得後処理
	reader.addEventListener('load', fileLoad, false);
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ファイルの中身取得後処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function fileLoad(e) {
	// 改行で分解
	let rows = e.target.result.split("\r\n");

	// ファイル判定
	if (rows[RECIPE_NAME].indexOf("KATA") != -1) {
		makeKataList(rows);
	} else if (rows[RECIPE_NAME].indexOf("NAME") != -1) {
		makeNameList(rows);
	} else { // 消去法でコメントファイルのはず
		makeCommentList(rows);
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ファイルの中身取得後処理
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// 型リスト
function makeNameList(e) {
	let cols;
	let i, j, k;

	// 13行目以降がデータ本体
	// ホルダリスト格納
	for (i = HOLDER_NAME_S; i < HOLDER_NAME_E; i++) {
		// データ分割
		cols = e[i].split("\t");

		// ホルダ名配列
		for (j = DATA_S; j < cols.length; j++) {
			//holderList[j - DATA_S][i - HOLDER_NAME_S] = cols[j].replace(/"/g, '');
			holderList[j - DATA_S][i - HOLDER_NAME_S] = toHex(cols[j].replace(/^"|"$/g, ''), 0);
		}
	}

	// ファイルリスト格納
	// ホルダ毎900点
	for (i = FILE_NAME_S; i < FILE_NAME_E; i++) {
		// データ分割
		cols = e[i].split("\t");

		// ファイルリスト配列
		for (j = DATA_S; j < cols.length; j++) {
			//fileHolder[j - DATA_S][i - FILE_NAME_S] = cols[j].replace(/"/g, '');
			fileHolder[j - DATA_S][i - FILE_NAME_S] = cols[j].replace(/^"|"$/g, '');
		}
	}
	// 各ホルダファイル毎分割
	for (i = 0; i < HOLDER_CNT; i++) {
		for (j = 0; j < FILE_CNT; j++) {
			// 30分割
			for (k = 0; k < FILE_NAME_LENGTH; k++) {
				// 最後は日付(SWAP処理はしない)
				if (k < (FILE_NAME_LENGTH / FILE_NAME_ITEM_NUM) * (FILE_NAME_ITEM_NUM - 1)) {
					fileList[i * FILE_CNT + j][k] = toHex(fileHolder[i][j * FILE_NAME_LENGTH + k], 0);
				} else {
					fileList[i * FILE_CNT + j][k] = toHex(fileHolder[i][j * FILE_NAME_LENGTH + k], 1);
				}
			}
		}
	}

	// 型リスト生成
	makeFileList();
	// 型データリスト生成
	makeDataList();
}

// 型データ
function makeKataList(e) {
	let cols;
	let i, j, k;

	// 13行目以降がデータ本体
	// 型データ格納
	for (i = KATA_S; i < KATA_E; i++) {
		// データ分割
		cols = e[i].split("\t");

		// 型データ配列
		for (j = DATA_S; j < cols.length; j++) {
			//dataList[j - DATA_S][i - KATA_S] = cols[j].replace(/"/g, '');
			dataList[j - DATA_S][i - KATA_S] = cols[j].replace(/^"|"$/g, '');
			// メモ画面処理
			if (i >= (KATA_S + MEMO_S)) {
				dataList[j - DATA_S][i - KATA_S] = toHex(dataList[j - DATA_S][i - KATA_S], 0);
			}
		}
	}

	// 型リスト生成
	makeFileList();
	// 型データリスト生成
	makeDataList();
}

// コメントリスト
function makeCommentList(e) {
	let cols;
	let i, j, k;

	for (i = 0; i < COMMENT_NUM; i++) {
		// データ分割
		cols = e[i].split("\t");

		commentList[i] = cols[1];
	}

	// 型データコメント
	for (i = 0; i < (SETTING_NUM / tentative); i++) {
		for (j = 0; j < tentative; j++) {
			moldDataList.rows[i + 1].cells[j * 3 + 1].textContent = commentList[(SETTING_NUM / tentative) * j + i];
		}
	}
	// 機能コメント
	for (i = 0; i < FUNCTION_NUM / tentative; i++) {
		for (j = 0; j < tentative; j++) {
			functionList.rows[i].cells[j * 2].textContent = commentList[(FUNCTION_S - SETTING_S) + (FUNCTION_NUM / tentative) * j + i];
		}
	}

	// タイミング画面
	timingDraw();
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 型リスト生成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function makeFileList() {
	let i, j, k, l, tmp;
	let holderName = document.getElementById("holderName");

	// ホルダ名
	for (i = 0; i < HOLDER_NAME_LENGTH; i++) {
		if (i == 0) tmp = ""; // 初期化
		l = holderList[holderNum][i];

		if (l === "0000") break; // "0000"は何も入力されていないと見做す
		tmp += l;
	}
	txtDecode(tmp, holderNum + 1, 0, "holderName");

	// ファイル名
	for (i = 0; i < (FILE_CNT / PAGE_CNT); i++) {
		// リストNo.
		moldList.rows[i + 1].cells[0].textContent = (FILE_CNT / PAGE_CNT) * pageNum + i + 1;
		// 3項目
		//品名 /作者 /日付
		for (k = 0; k < FILE_NAME_ITEM_NUM; k++) {
			// 1項目10ワード
			for (j = 0; j < (FILE_NAME_LENGTH / FILE_NAME_ITEM_NUM); j++) {
				if (j == 0) tmp = ""; // 初期化
				l = fileList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + i][k * (FILE_NAME_LENGTH / FILE_NAME_ITEM_NUM) + j];

				// 日付表示処理/1ワード目：日付/2ワード目：西暦
				if (k == (FILE_NAME_ITEM_NUM - 1)) {
					if (j > 1 || l === "0000") break;
					// 日付フォーマットが変わったらここを編集
					if (j == 0) tmp = l.substr(0, 2) + "月" + l.substr(2, 2) + "日";
					if (j == 1) tmp = l + "年" + tmp;
				} else {
					if (l === "0000") break; // "0000"は何も入力されていないと見做す
					tmp += l;
				}
			}
			(k != (FILE_NAME_ITEM_NUM - 1)) ? txtDecode(tmp, i + 1, k + 1, "fileName"): moldList.rows[i + 1].cells[k + 1].textContent = tmp;
		}
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 型データリスト生成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function makeDataList() {
	let i, j, k;

	// 型データ
	for (i = 0; i < (SETTING_NUM / tentative); i++) {
		for (j = 0; j < tentative; j++) {
			moldDataList.rows[i + 1].cells[j * 3 + 2].textContent = dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][SETTING_S + (SETTING_NUM / tentative) * j + i];
		}
	}

	// 機能
	for (i = 0; i < (FUNCTION_NUM / tentative); i++) {
		for (j = 0; j < tentative; j++) {
			k = dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][FUNCTION_S + (FUNCTION_NUM / tentative) * j + i];
			functionList.rows[i].cells[j * 2 + 1].textContent = k;

			if (k == 0) {
				functionList.rows[i].cells[j * 2 + 1].setAttribute("class", "functionValue a");
			} else if (k == 1) {
				functionList.rows[i].cells[j * 2 + 1].setAttribute("class", "functionValue b");
			} else if (k == 2) {
				functionList.rows[i].cells[j * 2 + 1].setAttribute("class", "functionValue c");
			} else if (k > 2) {
				functionList.rows[i].cells[j * 2 + 1].setAttribute("class", "functionValue d");
			}
		}
	}

	// 上下ヒータ点火率
	upperHeaterRatio();
	lowerHeaterRatio();
	// CLSヒータ温度
	clsPreheat();
	clsOpe();
	// メモ画面
	memoTableOne();
	memoTableTwo();
	// タイミング画面
	timingDraw();
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 文字コード変換の為のあれこれ
/ http://marycore.jp/prog/js/convert-decimal-hex/
/ https://note.cman.jp/convert/bit/
/ https://so-zou.jp/web-app/text/encode-decode/
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
