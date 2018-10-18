// FLTC反対勝手
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
RATIO_UP_ROW = 9; // 上ヒータ行数(標準:9)
RATIO_UP_COL = 17; // 上ヒータ列数(標準:19)
RATIO_CORNER = 0; // U字ヒータ数(標準:2)
RATIO_DOWN_ROW = 9; // 下ヒータ行数(標準:9)
RATIO_DOWN_COL = 17; // 下ヒータ列数(標準:19)
FLOW = 1; // 0:正規勝手/1:反対勝手(使い道無かった)
CLS_PEHEATING_NUM = 30; // CLSヒータ予熱温度点数
CLS_OPERATION_NUM = 30; // CLSヒータ運転温度点数
//
FUNCTION_S = 1264; // 機能開始アドレス
FUNCTION_NUM = 64; // 機能点数(何とFLCは80点)

// 型データ構成
// 「0」始まりとします。(W0~2048点)
// UPPER_HEATER_ADD行列の最大値+1
RATIO_U_S = 153; // U字ヒータ開始アドレス(標準:171)

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
RATIO_UP_ROW_HEADER.length = 0;
RATIO_UP_COL_HEADER.length = 0;
RATIO_DOWN_ROW_HEADER.length = 0;
RATIO_DOWN_COL_HEADER.length = 0;

RATIO_UP_ROW_HEADER = [9, 8, 7, 6, 5, 4, 3, 2, 1]; // 上の行(要素数はRATIO_UP_ROWの内容と同じ)
RATIO_UP_COL_HEADER = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]; // 上の列(要素数はRATIO_UP_COLの内容と同じ)
RATIO_DOWN_ROW_HEADER = [9, 8, 7, 6, 5, 4, 3, 2, 1]; // 下の行(要素数はRATIO_DOWN_ROWの内容と同じ)
RATIO_DOWN_COL_HEADER = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]; // 下の列(要素数はRATIO_DOWN_COLの内容と同じ)