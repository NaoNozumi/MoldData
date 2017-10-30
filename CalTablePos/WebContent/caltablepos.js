/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*  初期設定
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
// 変数宣言
var threshold = Math.PI / 2; // 閾値
var fullstroke = Math.PI; // フルストローク
var steptime = 100; // 演算回数

// 各パラメータ
var x_init = 600; // クランク軸位置
var y_init = 135.647; // クランク軸位置
var R = 210; // クランク半径
var L = 600; // コンロッド長さ
var l = 250; // レバー長さ
var l1 = 140; // テーブルレバー長さ
var lever_angle = cosineFormula(l, l1, 219.8);
var L1 = 465; // テーブルアーム長さ
// 初期状態
var La = pythagoreanTheorem(x_init, y_init);

// 演算途中経過
var A = new Array(steptime + 1);
var x = new Array(steptime + 1); // クランク座標
var y = new Array(steptime + 1); // クランク座標
var θ11 = new Array(steptime + 1); // テーブルレバー角度
var θ12 = new Array(steptime + 1);
var S = new Array(steptime + 1);
var S_inv = new Array(steptime + 1);
var θrod = new Array(steptime + 1);
var con_x = new Array(steptime + 1); // コネクティングロッド
var con_y = new Array(steptime + 1); // コネクティングロッド

// 描画領域
var testarea = document.getElementById("test");
var testctx = testarea.getContext("2d");
var load_cnt = 0; // 読込完了カウンタ

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*  アニメーション用の画像を準備
*  http://himaxoff.blog111.fc2.com/blog-entry-87.html
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
// Imageオブジェクト生成
var img_connecting_rod = new Image();
var img_connecting_rod01 = new Image();
var img_l = new Image();
var img_L1 = new Image();
var img_R = new Image();
//
img_connecting_rod.src = "./img/connecting_rod.png?" + new Date().getTime();
img_connecting_rod01.src = "./img/connecting_rod01.png?" + new Date().getTime();
img_l.src = "./img/l.png?" + new Date().getTime();
img_L1.src = "./img/L1.png?" + new Date().getTime();
img_R.src = "./img/R.png?" + new Date().getTime();

// 画像が読み込まれるのを待ち、処理続行
img_connecting_rod.onload = function() {
    load_cnt++;
}
img_connecting_rod01.onload = function() {
    load_cnt++;
}
img_l.onload = function() {
    load_cnt++;
}
img_L1.onload = function() {
    load_cnt++;
}
img_R.onload = function() {
    load_cnt++;
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*  gifアニメーションテスト
*  http://www.sist.ac.jp/~kanakubo/programming/canvas/canvas3.html
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
function gifAnime() {
    // 画像が読み込み足りなければ抜ける
    if (load_cnt != 5) {
        return;
    }
    // アニメーション
    var count = 0;
    // (0,0)座標位置
    var x_offset = 200 + 54;
    var y_offset = 605 + 45;
    var timer = setInterval(function() {
        // 計算結果
        tablePos.innerHTML = "<dt>クランク角度</dt><dd>" + (A[count] / Math.PI * 180).toFixed(2) + "[deg]</dd>" +
            "<dt>テーブル位置</dt><dd>" + S[count].toFixed(2) + "[mm]</dd>";

        // Canvas全体をクリア
        testctx.clearRect(0, 0, testarea.width, testarea.height);
        // l
        // 現状保存
        testctx.save();
        testctx.translate(x_offset, y_offset);
        testctx.rotate(-1 * θ11[count]);
        testctx.drawImage(img_l, -56, -175); // 回転中心座標
        // リストア
        testctx.restore();
        // R
        // 現状保存
        testctx.save();
        testctx.translate(x_offset + x_init + 340, y_offset - y_init); // 340mmずれる
        testctx.rotate(-1 * A[count]);
        testctx.drawImage(img_R, -76, -76); // 回転中心座標
        // リストア
        testctx.restore();
        // connecting_rod
        // 現状保存
        testctx.save();
        testctx.translate(x_offset + x[count] + 340, y_offset - y[count]); // 340mmずれる
        testctx.rotate(-1 * θrod[count]);
        testctx.globalAlpha = 0.75;
        testctx.drawImage(img_connecting_rod, -636, -156); // 回転中心座標
        // リストア
        testctx.restore();
        // connecting_rod01
        // 現状保存
        testctx.save();
        testctx.translate(x_offset + con_x[count] + 340, y_offset - con_y[count]); // 340mmずれる
        testctx.globalAlpha = 0.75;
        testctx.drawImage(img_connecting_rod01, -908, -156); // 回転中心座標
        // リストア
        testctx.restore();
        // L1
        // 現状保存
        testctx.save();
        testctx.translate(x_offset, y_offset - S_inv[count]);
        testctx.rotate(-1 * θ12[count]);
        testctx.globalAlpha = 0.75;
        testctx.drawImage(img_L1, -44, -45); // 回転中心座標
        // リストア
        testctx.restore();

        // カウントアップ
        count++;
        if (count >= A.length) {
            clearInterval(timer);
        }
    }, 60);
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*  フルストローク移動ループ
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
function move() {
    var step, amount; // ループ用
    var Lb, θb, θc; // 演算途中経過
    var B; // レバー角度
    var lx, ly; // レバー座標

    // 初期化と移動巾
    amount = fullstroke / steptime;
    // プラテン位置計算
    for (step = 0; step <= steptime; step++) {
        // クランク座標
        A[step] = amount * step;
        x[step] = R * Math.cos(amount * step) + x_init;
        y[step] = R * Math.sin(amount * step) + y_init;
        //
        Lb = pythagoreanTheorem(x[step], y[step]);
        // レバー座標
        θb = Math.atan(y[step] / x[step]);
        θc = cosineFormula(l, Lb, L);
        // レバー角度
        B = θb + θc;
        if (step == 0) {
            var temp1 = B - lever_angle;
        }
        var temp3 = B - lever_angle;
        θ11[step] = temp3 - temp1;
        // コネクティングロッド角度
        con_x[step] = l * Math.cos(B);
        con_y[step] = l * Math.sin(B);
        θrod[step] = Math.atan((con_y[step] - y[step]) / (con_x[step] - x[step]));
        // テーブル変位量
        lx = l1 * Math.cos(temp3);
        ly = l1 * Math.sin(temp3);
        S_inv[step] = Math.sqrt(Math.pow(L1, 2) - Math.pow(lx, 2)) + ly;
        S[step] = L1 + l1 - S_inv[step];
        // テーブルアーム角度
        if (step == 0) {
            var temp2 = Math.asin(lx / L1);
        }
        θ12[step] = Math.asin(lx / L1) - temp2;
    }
    // リアルアニメーション描画
    gifAnime();
}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*  余弦定理
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
function cosineFormula(a, b, c) {
    return Math.acos((Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b));
};

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
*  鉤股弦の法
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
function pythagoreanTheorem(a, b) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
};
