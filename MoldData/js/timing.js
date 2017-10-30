// タイミング画面デザイン
const timingItemHeight = 40; // 1行の高さ
const timingItemWidthName = 260; // 名称表示部幅
const timingItemWidthOnoff = 80; // on/off数値表示部幅
const timingItemWidthOneLap = 360; // 360度幅
const timingItemNum = TIMING_NUM / 2; // **項目
const onoffItemHeight = 32; // on/off表示部品高さ
const onoffColor = new Array("#ff0000", "#0000ff");
const nameFontSize = 16; // 名称フォントサイズ
const onoffFontSize = 14; // on/offフォントサイズ

const timingHeight = timingItemHeight * timingItemNum; // タイミング画面全体高さ
const timingWidth = timingItemWidthName + timingItemWidthOneLap; // タイミング画面全体幅

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ タイミング画面を描く
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
var timingCanvas1 = document.getElementById("timing1");
timingCanvas1.setAttribute("height", timingHeight);
timingCanvas1.setAttribute("width", timingWidth);

if (!timingCanvas1 || !timingCanvas1.getContext) {
    console.log("canvasが利用できるWebブラウザで開いてください。");
}

// 2Dコンテキスト
var timingCtx1 = timingCanvas1.getContext("2d");

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ タイミング画面描画
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function timingDraw() {
    var i, j, k, l, m, n;
    var text;

    // クリア
    timingCtx1.clearRect(0, 0, timingCanvas1.width, timingCanvas1.height);
    // 横線
    timingCtx1.beginPath(); // 線を描くと宣言
    timingCtx1.lineWidth = 1;
    timingCtx1.strokeStyle = "#999999"
    for (i = 0; i < timingItemNum - 1; i++) {
        timingCtx1.moveTo(0, timingItemHeight * (i + 1));
        timingCtx1.lineTo(timingWidth, timingItemHeight * (i + 1));
    }
    timingCtx1.stroke();

    // 縦線(項目名)
    timingCtx1.beginPath(); // 線を描くと宣言
    timingCtx1.lineWidth = 2;
    timingCtx1.strokeStyle = "#999999"
    timingCtx1.moveTo(timingItemWidthName, 0);
    timingCtx1.lineTo(timingItemWidthName, timingHeight);
    timingCtx1.stroke();

    // 縦線(タイミング)
    timingCtx1.beginPath(); // 線を描くと宣言
    timingCtx1.lineWidth = 1;
    timingCtx1.strokeStyle = "#cccccc"
    j = timingItemWidthOneLap / 4; // 90度毎
    for (i = 0; i < 3; i++) {
        timingCtx1.moveTo(timingItemWidthName + j * (i + 1), 0);
        timingCtx1.lineTo(timingItemWidthName + j * (i + 1), timingHeight);
    }
    timingCtx1.stroke();

    // ON/OFF表示
    // 幅：3px
    m = (timingItemHeight - onoffItemHeight) / 2; // ON/OFF部品Y方向オフセット量
    for (i = 0; i < timingItemNum; i++) {
        l = timingItemHeight * i; // Y座標
        for (j = 0; j < 2; j++) {
            n = parseInt(dataList[holderNum * FILE_CNT + pageNum * (FILE_CNT / PAGE_CNT) + fileNum][TIMING_S + i * 2 + j], 10); // タイミング設定値
            if (isNaN(n)) break; // 数値でない場合は終了

            k = timingItemWidthName + n / 3600 * timingItemWidthOneLap; // X座標

            // ctx.fillRect(x, y, width, height)
            timingCtx1.fillStyle = onoffColor[j];
            timingCtx1.fillRect(k - 1, l + m, 3, onoffItemHeight); // ON/OFF部品

            // ctx.fillText(text, x, y [, maxWidth ] )
            // http://www.html5.jp/canvas/ref/property/textAlign.html
            timingCtx1.font = onoffFontSize + "px sans-serif";
            (j == 0) ? text = "ON: " + n / 10 + " ˚": text = "OFF: " + n / 10 + " ˚";
            timingCtx1.fillText(text, timingItemWidthName - timingItemWidthOnoff, l + j * (timingItemHeight / 2) + timingItemHeight / 4 + onoffFontSize / 2, timingItemWidthOnoff); // on/off角度
        }
    }

    // コメント描画
    timingCommDraw();
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ タイミング画面コメント描画
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function timingCommDraw() {
    var i, j, k, l, m, n;

    for (i = 0; i < timingItemNum; i++) {
        j = timingItemHeight * i; // Y座標

        timingCtx1.fillStyle = "#333333";
        timingCtx1.font = nameFontSize + "px sans-serif";
        timingCtx1.fillText(commentList[(TIMING_S - SETTING_S) + i * 2], 0, j + timingItemHeight / 2 + nameFontSize / 2, timingItemWidthName - timingItemWidthOnoff); // コメント
    }
}
