/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 初期設定、その他説明
/ 基本編集するのはこのファイルとratioArray.jsのみ、としたい…
/ 2017/10作成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
/*
その1) ./js/memo.jsファイルは、万一メモ画面のレイアウト等が変わるような事があった場合に編集する。
その2) ratioArray.jsは個々のヒータのアドレスを配列の形で記入する。
その3)
その4)
*/

// 点火率画面情報
// ハーフヒータも1行・1列として数えること
const RATIO_UP_ROW = 8; // 上ヒータ行数(標準:9)
const RATIO_UP_COL = 22; // 上ヒータ列数(標準:19)
const RATIO_CORNER = 2; // U字ヒータ数(標準:2)
const RATIO_DOWN_ROW = 8; // 下ヒータ行数(標準:9)
const RATIO_DOWN_COL = 22; // 下ヒータ列数(標準:19)
const FLOW = 0; // 0:正規勝手/1:反対勝手(使い道無かった)
const CLS_PEHEATING_NUM = 30; // CLSヒータ予熱温度点数
const CLS_OPERATION_NUM = 30; // CLSヒータ運転温度点数

// 型データ構成
// 「0」始まりとします。(W0~2048点)
// UPPER_HEATER_ADD行列の最大値+1
const RATIO_U_S = 176; // U字ヒータ開始アドレス(標準:171)

// 点火率画面テーブルの番号
// 点火率画面(GOTそのもの)で**行**列を表している番号
// ハーフは同じ番号を2個記載すること
// 表示に関わるだけなので、極端な話何を書いても構わない
/*
□ □ □ □ □ □ □ □ □ 4
□ □ □ □ □ □ □ □ □ 3
□ □ □ □ □ □ □ □ □ 2
□ □ □ □ □ □ □ □ □ 1
9 8 7 6 5 4 3 2 1
*/
const RATIO_UP_ROW_HEADER = new Array("H", "G", "F", "E", "D", "C", "B", "A"); // 上の行(要素数はRATIO_UP_ROWの内容と同じ)
const RATIO_UP_COL_HEADER = new Array(22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1); // 上の列(要素数はRATIO_UP_COLの内容と同じ)
const RATIO_DOWN_ROW_HEADER = new Array("H", "G", "F", "E", "D", "C", "B", "A"); // 下の行(要素数はRATIO_DOWN_ROWの内容と同じ)
const RATIO_DOWN_COL_HEADER = new Array(22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1); // 下の列(要素数はRATIO_DOWN_COLの内容と同じ)
