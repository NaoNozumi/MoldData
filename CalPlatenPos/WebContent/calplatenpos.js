
/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*  初期設定
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
// 変数宣言
//var Pos=0;
var threshold = 170; // 閾値
var fullstroke = 310; // フルストローク
var steptime = 100; // 演算回数
// 各パラメータ
var La;
var Lb = 320;
var Lc = 140;
var Ld = 200;
// 演算途中経過
var θ;
var a;
var α;
var β;
var H;
var γ;
// 座標
var coordinate = new Array(steptime + 1);
var ret_ar = new Array(3); // 関数戻り値用
var x_offset = 10; //
// 結果表示
var result = document.getElementById("platenPos")

// 描画領域
/*var canvas = document.getElementById("diagonal");
var context = canvas.getContext("2d");*/

// 描画領域(テスト用)
var testarea = document.getElementById("test");
var testctx = testarea.getContext("2d");
var load_cnt = 0; // 読込完了カウンタ
// 角度格納
var beta = new Array(steptime + 1);
var gamma = new Array(steptime + 1);
var delta = new Array(steptime + 1);
//
var temp;

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*  アニメーション用の画像を準備
*  http://himaxoff.blog111.fc2.com/blog-entry-87.html
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
// Imageオブジェクト生成
var img_Lb = new Image();
var img_Lc = new Image();
var img_Ld = new Image();
var nut = new Image();
//
img_Lb.src = "./img/Lb.png?" + new Date().getTime();
img_Lc.src = "./img/Lc.png?" + new Date().getTime();
img_Ld.src = "./img/Ld.png?" + new Date().getTime();
nut.src = "./img/nut.png?" + new Date().getTime();

// 画像が読み込まれるのを待ち、処理続行
img_Lb.onload = function() {
    //testctx.drawImage(img_Lb, 0, 0);
    load_cnt++;
}
img_Lc.onload = function() {
    //testctx.drawImage(img_Lc, 0, 0);
    load_cnt++;
}
img_Ld.onload = function() {
    //testctx.drawImage(img_Ld, 0, 0);
    load_cnt++;
}
nut.onload = function() {
    //testctx.drawImage(nut, 0, 0);
    load_cnt++;
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*  gifアニメーションテスト
*  http://www.sist.ac.jp/~kanakubo/programming/canvas/canvas3.html
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
function gifAnime() {
    // 画像が読み込み足りなければ抜ける
    if (load_cnt != 4) {
        return;
    }
    // アニメーション
    var count = 0;
    var timer = setInterval(function() {
        // 計算結果
        platenPos.innerHTML = "<dt>プラテン位置</dt><dd>" + (Lb + Lc - coordinate[count][3]).toFixed(2) + "[mm]</dd>" +
            "<dt>サーボ位置</dt><dd>" + coordinate[count][1].toFixed(2) + "[mm]</dd>";
        // Canvas全体をクリア
        testctx.clearRect(0, 0, testarea.width, testarea.height);
        // Ld
        // 現状保存
        testctx.save();
        testctx.translate(278, coordinate[count][1] + 78);
        testctx.rotate(delta[count]);
        testctx.drawImage(img_Ld, -141, -38);
        // リストア
        testctx.restore();
        // nut
        // 現状保存
        testctx.save();
        testctx.globalAlpha = 0.8;
        testctx.drawImage(nut, 231, coordinate[count][1] + 31); // Y座標は(78 - 47 = 31)
        // リストア
        testctx.restore();
        // Lb
        // 現状保存
        testctx.save();
        testctx.translate(78, 78 + threshold + coordinate[count][3]);
        testctx.rotate(gamma[count]);
        testctx.drawImage(img_Lb, -78, -398);
        // リストア
        testctx.restore();
        // Lc
        // 現状保存
        testctx.save();
        testctx.translate(78, 78 + threshold);
        testctx.rotate(-beta[count]);
        testctx.globalAlpha = 0.8;
        testctx.drawImage(img_Lc, -78, -78);
        // リストア
        testctx.restore();
        // カウントアップ
        count++;
        if (count >= beta.length) {
            clearInterval(timer);
        }
    }, 60);
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*  フルストローク移動ループ
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
function move() {
    var step, y, ar;
    var ar = new Array(3);

    // 初期化と移動巾
    y = fullstroke / steptime;
    // プラテン位置計算
    for (step = 0; step < steptime + 1; step++) {
        coordinate[step] = new Array(3);
        // 座標はPos,C,B
        // Pos
        coordinate[step][0] = Ld;
        coordinate[step][1] = y * step;
        // 関数呼び出し
        ar = CalPlatenPos(y * step, step);
        // C,B
        coordinate[step][2] = 0;
        Array.prototype.push.apply(coordinate[step], ar);
        // For Debug
        //console.log(coordinate[step]);
    }

    // アニメーション描画
    // https://techacademy.jp/magazine/9784
    /*var count = 0;
    var timer = setInterval(function() {
        animPlaten(coordinate[count]);
        count++;
        if (count >= coordinate.length) {
            clearInterval(timer);
        }
    }, 60);*/

    // リアルアニメーション描画
    gifAnime();
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*  アニメーション描画
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
function animPlaten(arPos) {
    // Canvas全体をクリア
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 外観設定
    context.lineWidth = 2;
    context.strokeStyle = "#666666";

    // 絶対座標でパスを作成する
    context.beginPath();

    // Lc to Lb
    context.moveTo(0 + x_offset, threshold);
    context.lineTo(arPos[4] + x_offset, arPos[5] + threshold);
    context.lineTo(arPos[2] + x_offset, arPos[3] + threshold);
    // Ld
    context.moveTo(arPos[4] + x_offset, arPos[5] + threshold);
    context.lineTo(arPos[0] + x_offset, arPos[1]);
    context.moveTo(arPos[0] + x_offset + 200, arPos[1]);
    context.lineTo(2 * arPos[0] + x_offset - arPos[4] + 200, arPos[5] + threshold);
    // Lc to Lb
    context.moveTo(2 * arPos[0] + x_offset - 0 + 200, threshold);
    context.lineTo(2 * arPos[0] + x_offset - arPos[4] + 200, arPos[5] + threshold);
    context.lineTo(2 * arPos[0] + x_offset - arPos[2] + 200, arPos[3] + threshold);
    // For Debug
    //console.log(arPos[2], Lb + Lc - arPos[3]);

    // ラインをキャンバスに描き出す
    context.stroke();
    platenPos.innerHTML = "<dt>プラテン位置</dt><dd>" + (Lb + Lc - arPos[3]).toFixed(2) + "[mm]</dd>" +
        "<dt>サーボ位置</dt><dd>" + arPos[1].toFixed(2) + "[mm]</dd>";
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*  プラテン位置計算
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
function CalPlatenPos(Pos, index) {
    // Posの値がストローク外であった場合は終了
    if (0 > Pos || Pos > fullstroke) {
        // 結果
        ret_ar[0] = 0;
        ret_ar[1] = 0;
        ret_ar[2] = 0;
        beta[index] = 0;
        gamma[index] = 0;
    } else {
        // Posの値がストローク内
        if (0 <= Pos && Pos < threshold) {
            θ = Math.atan(Ld / (threshold - Pos));
            a = (threshold - Pos) / Math.cos(θ);
            α = Calα(a);
            β = Math.PI - θ - α;
            // Ld初期角度
            if (Pos == 0) {
                temp = θ - Math.acos((a * a + Ld * Ld - Lc * Lc) / (2 * a * Ld));
            }
            delta[index] = θ - Math.acos((a * a + Ld * Ld - Lc * Lc) / (2 * a * Ld)) - temp;
        } else if (threshold <= Pos && Pos <= fullstroke) {
            θ = Math.atan((Pos - threshold) / Ld);
            a = Ld / Math.cos(θ);
            α = Calα(a);
            β = Math.PI / 2 - θ - α;
            delta[index] = Math.PI / 2 + θ - Math.acos((a * a + Ld * Ld - Lc * Lc) / (2 * a * Ld)) - temp;
        }
        H = Lc * Math.sin(β);
        γ = Math.asin(H / Lb);
        La = Math.sqrt(Math.pow(Lc, 2) + Math.pow(Lb, 2) - 2 * Lc * Lb * Math.cos(Math.PI - β - γ));
        // 結果
        ret_ar[0] = La;
        ret_ar[1] = Lc * Math.sin(β);
        ret_ar[2] = Lc * Math.cos(β);
        beta[index] = β;
        gamma[index] = γ;
        console.log(delta[index]);
    }
    // 戻り値
    return ret_ar;
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*  α計算
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
function Calα(aa) {
    // 演算途中経過用
    var x, y;

    // 途中経過
    x = Math.pow(aa, 2) + Math.pow(Lc, 2) - Math.pow(Ld, 2);
    y = 2 * aa * Lc;
    return Math.acos(x / y);
}
